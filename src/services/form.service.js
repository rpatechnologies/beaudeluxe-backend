class FormService {
    constructor() {
        this.oldFormData = {};
    }

    setOldFormData(data) {
        this.oldFormData = data;
    }

    getOldFormData() {
        return this.oldFormData;
    }
}
  
module.exports = FormService;