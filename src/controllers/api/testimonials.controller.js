const { body, validationResult } = require('express-validator');
const moment = require("moment");
const models = require("../../models");
const Testimonials   = models.testimonials;

module.exports = {
    // id, name, country, rating, description, photo, status, publishedAt
	testimonials: async function (req, res) {
		try {
			const testimonials = await Testimonials.findAll({
				where: {status: 1}, 
                attributes: ['id', 'name', 'country', 'rating', 'description', 'photo', 'altTag', 'status', 'publishedAt'],
				order: [ ['publishedAt', 'DESC'] ]
			});
			let response = []
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
				}
				response.push(object);
			}
          
            return res.status(200).json({
				status: true,
				message: "Data fetched successfully.",
				data: response,
			});
		} catch (error) {
			// console.log(error);
			console.log("Error While implementing Testimonials API");
		}
	}
}; 