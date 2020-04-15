let test = "{'small': 'http://img1.doubanio.com/view/photo/s_ratio_poster/public/p2219011938.jpg', 'large': 'http://img1.doubanio.com/view/photo/s_ratio_poster/public/p2219011938.jpg', 'medium': 'http://img1.doubanio.com/view/photo/s_ratio_poster/public/p2219011938.jpg'}";
let test2 = test.replace(/'/g, '"');
console.log(JSON.parse(test2).small);
