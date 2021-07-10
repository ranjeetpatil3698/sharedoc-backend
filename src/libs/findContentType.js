
 const findContentType=(base64string) => {
    const arr = base64string.split(";");
    let ContentType;
    let data;
    ContentType = arr[0].split(":")[1];
    data = arr[1].split(",")[1];
    return [ContentType, data];
};

export {findContentType};