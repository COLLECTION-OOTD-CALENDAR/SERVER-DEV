module.exports = function(app){
    const ootd = require('./ootdController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    const {response} = require("../../../config/response");    
    const baseResponse = require("../../../config/baseResponseStatus");
    const upload = require('../../../config/Multer');


    //8-1. 이미지 S3 업로드 API
    app.post('/app/ootd/upload-photo', upload.single('image'), function(req, res)
    {   
        const Img = req.file;
        
        res.send(response(baseResponse.SUCCESS_IMAGE_URL, {'s3 imageUrl' : Img.location}));               
    });


    // 9. 사용자 추가 블럭 등록 API 
    app.post('/app/ootd/new-block', jwtMiddleware, ootd.ootdNewBlock); 
    
    
    //9-1. 사용자 추가 블럭 삭제 API 
    app.patch('/app/ootd/delete-block',jwtMiddleware, ootd.ootdDeleteBlock); 


    //11. 사용자 추가 블럭 등록 API
    app.patch('/app/ootd/deletion',jwtMiddleware, ootd.ootdDeletion); 



    //[archived] s3 업로드 presignedUrl 부여 API
    app.get('/app/ootd/s3-authentication',jwtMiddleware, ootd.ootdS3Authentication); //getPreSignUrl

};