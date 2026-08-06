const db = require("../models");
const Setting = db.setting;
const HomePageContents = db.homePageContents;

const settingData = async () => {
    const settings = await Setting.findAll();
    const object = {};
    for (let i = 0; i < settings.length; i++) {
        const data = settings[i];
        object[data.field] = data.value;
    }
    return object;
}

const homePageContentsData = async () => {
    const homePageContents = await HomePageContents.findAll();
    const object = {};
    for (let i = 0; i < homePageContents.length; i++) {
        const data = homePageContents[i];
        object[data.field] = data.value;
    }
    return object;
}

const createSlug = title => {
    let slug;

    // convert to lower case
    slug = title.toLowerCase();

    // remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");

    // remove consecutive dash symbols 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
};

module.exports = {
    settingData,
    createSlug,
    homePageContentsData
}