const { body, validationResult } = require('express-validator');
const moment = require("moment");
const models = require("../../models");
const { Op } = require("sequelize");
const Testimonials   = models.testimonials;
const Banner         = models.banner;
const Page           = models.page;
const MetaContents   = models.metaContents;

const fetchMeta = async (slugs) => {
  try {
    const slugList = Array.isArray(slugs) ? slugs : [slugs];
    const meta = await MetaContents.findOne({
      where: {
        slug: { [Op.in]: slugList }
      },
      attributes: ["id", "metaTitle", "metaDescription", "metaKeywords", "h1", "h2", "slug"]
    });
    if (meta) {
      return meta.toJSON();
    }
    const defaultMeta = await MetaContents.findOne({
      where: { slug: "home" },
      attributes: ["id", "metaTitle", "metaDescription", "metaKeywords", "h1", "h2", "slug"]
    });
    return defaultMeta ? defaultMeta.toJSON() : null;
  } catch (err) {
    console.error("Error fetching meta content:", err);
    return null;
  }
};

module.exports = {
	testimonials: async function (req, res) {
		try {
			let banner = null;
			try {
				const pageRecord = await Page.findOne({
					where: {
						[Op.or]: [
							{ name: { [Op.like]: "%Testimonial%" } },
							{ slug: "testimonials" },
							{ slug: "testimonial" }
						]
					}
				});

				let bannerWhere = { status: 1 };
				if (pageRecord) {
					bannerWhere.page_id = pageRecord.id;
				}

				const bannerRecord = await Banner.findOne({
					where: bannerWhere,
					include: [
						{
							model: Page,
							required: false
						}
					],
					order: [["id", "DESC"]]
				});

				if (bannerRecord) {
					banner = {
						id: bannerRecord.id,
						page_id: bannerRecord.page_id,
						page_name: bannerRecord.page ? bannerRecord.page.name : null,
						title: bannerRecord.title,
						image: bannerRecord.image ? `${siteUrl}/uploads/banners/${bannerRecord.image}` : null,
						altTagImage: bannerRecord.altTagImage || null,
						mob_image: bannerRecord.image_mob ? `${siteUrl}/uploads/banners/${bannerRecord.image_mob}` : null,
						altTagImageMob: bannerRecord.altTagImageMob || null,
						description: bannerRecord.description || null,
					};
				}
			} catch (err) {
				console.error("Error fetching testimonials banner:", err);
			}

			const meta = await fetchMeta(["testimonials", "testimonial", "/testimonials"]);

			const testimonials = await Testimonials.findAll({
				where: {status: 1}, 
                attributes: ['id', 'name', 'country', 'rating', 'description', 'photo', 'altTag', 'status', 'publishedAt'],
				order: [ ['publishedAt', 'DESC'] ]
			});
			let list = [];
			for(let i = 0; i < testimonials.length; i++)
			{
				const item = testimonials[i];
				const object = {
                    id : item.id, 
                    name : item.name, 
                    country : item.country, 
                    rating : item.rating, 
                    description : item.description, 
                    photo : `${siteUrl}/uploads/testimonials/${item.photo}`,
					altTag: item.altTag,
                    status : item.status, 
                    publishedAt : item.publishedAt
				};
				list.push(object);
			}
          
			const response = {
				meta: meta,
				banner: banner,
				testimonials: list
			};

            return res.status(200).json({
				status: true,
				message: "Data fetched successfully.",
				data: response,
			});
		} catch (error) {
			console.log("Error While implementing Testimonials API", error);
			return res.status(500).json({
				status: false,
				message: error.message || "Error While implementing Testimonials API"
			});
		}
	}
}; 