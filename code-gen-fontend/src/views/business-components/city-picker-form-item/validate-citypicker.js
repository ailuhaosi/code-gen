export let validateCityPicker = (rule, value, callback, that) => {
    const isPass = value.province && value.city && value.area;
    if (!isPass) {
        callback(new Error('省/市/区必须选择'));
    } else {
        callback();
    }
}