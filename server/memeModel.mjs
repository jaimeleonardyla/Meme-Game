function Image(id,url){
    this.id = id;
    this.image_url = url;
}

function Caption(id,text){
    this.id = id;
    this.text = text;
}


export {Image, Caption};