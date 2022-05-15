//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS_REGISTER : { "isSuccess": true, "code": 1000, "message":"회원가입 성공" },
    SUCCESS_LOGIN : { "isSuccess": true, "code": 1001, "message":"로그인 성공" },
    SUCCESS_USERS_MODI : { "isSuccess": true, "code": 1002, "message":"회원정보 수정 성공" },
    SUCCESS_UNREGISTER : { "isSuccess": true, "code": 1003, "message":"회원탈퇴 성공" },
    SUCCESS_MONTHLY_CALENDAR : { "isSuccess": true, "code": 1004, "message":"Monthly OOTD 불러오기 성공" },
    SUCCESS_WEEKLY_CALENDAR : { "isSuccess": true, "code": 1005, "message":"Weekly OOTD 불러오기 성공" },
    SUCCESS_NEW_BLOCK : { "isSuccess": true, "code": 1007, "message":"사용자 블럭 추가 성공" },
    SUCCESS_LAST_REGISTER : { "isSuccess": true, "code": 1008, "message":"OOTD 최종 등록 성공" },
    SUCCESS_OOTD_MODI : { "isSuccess": true, "code": 1012, "message":"지난 작성 화면 보여주기 성공" },
    SUCCESS_OOTD_DELETION : { "isSuccess": true, "code": 1013, "message":"OOTD 삭제 성공" },
    SUCCESS_OOTD_COMPLETE : { "isSuccess": true, "code": 1014, "message":"OOTD 완료 페이지 불러오기 성공" },
    SUCCESS_MYLOOK_MAIN : { "isSuccess": true, "code": 1015, "message":"MY LOOK 메인 페이지 불러오기 성공" },
    SUCCESS_MYLOOK_DETAIL : { "isSuccess": true, "code": 1016, "message":"MY LOOK 상세페이지 불러오기 성공" },
    SUCCESS_SEARCH_MAIN : { "isSuccess": true, "code": 1017, "message":"PWWC 검색 초기 화면 불러오기 성공 " },
    SUCCESS_SEARCH_DELETION : { "isSuccess": true, "code": 1018, "message":"PWWC 검색 History 삭제 성공" },
    SUCCESS_SEARCH_ADDITION : { "isSuccess": true, "code": 1019, "message":"History 추가 성공" },
    SUCCESS_MATCH : { "isSuccess": true, "code": 1020, "message":"매칭 페이지 검색 결과 불러오기 성공" },
    SUCCESS_DUPLICATE_ID : { "isSuccess": true, "code": 1021, "message":"새로운 아이디 확인 성공" },
    SUCCESS_DUPLICATE_NICKNAME : { "isSuccess": true, "code": 1022, "message":"새로운 닉네임 확인 성공" },
    SUCCESS_MATCH_DATE : { "isSuccess": true, "code": 1023, "message":"날짜 기반 매칭 페이지 검색 결과 불러오기 성공" },
    SUCCESS_DELETE_BLOCK : { "isSuccess": true, "code": 1024, "message":"사용자 블럭 삭제 성공" },
    SUCCESS_IMAGE_URL : { "isSuccess": true, "code": 1025, "message":"이미지 url 변환 성공" },  
    SUCCESS_SEARCH_SUGGEST : { "isSuccess": true, "code": 1026, "message":"매칭 페이지 검색 키워드 제안 성공" },
    SUCCESS_S3_PRESIGNEDURL : { "isSuccess": true, "code": 1027, "message":"s3 presignedURL 발급 성공" },
    SUCCESS_OOTD_DEFAULT : { "isSuccess": true, "code": 1028, "message":"추가한 블럭 불러오기 성공" },
    SUCCESS_FIND_ID : { "isSuccess": true, "code": 1029, "message":"아이디 찾기 성공" },
    SUCCESS_FIND_PW : { "isSuccess": true, "code": 1030, "message":"비밀번호 찾기 성공" },
    SUCCESS_RESET_PW : { "isSuccess": true, "code": 1031, "message":"비밀번호 재설정 성공" },
    SUCCESS_SEND_SMS : { "isSuccess": true, "code": 1032, "message": "인증번호 발송 성공" },

    // Common
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 2000, "message":"JWT 토큰 검증 성공" },  
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 2001, "message":"JWT 토큰 검증 실패" },
    TOKEN_EMPTY : { "isSuccess": false, "code": 2002, "message":"JWT 토큰을 입력해주세요." },



    //Request error

    REGISTER_ID_EMPTY : { "isSuccess": false, "code": 3000, "message":"아이디를 입력해주세요" },
    REGISTER_ID_LENGTH : { "isSuccess": false, "code": 3001, "message":"아이디는 6~15자리를 입력해주세요" },
    REGISTER_ID_REDUNDANT : { "isSuccess": false, "code": 3002, "message":"이미 존재하는 아이디입니다." },

    REGISTER_PW_EMPTY : { "isSuccess": false, "code": 3003, "message":"비밀번호를 입력해주세요" },
    REGISTER_PW_LENGTH : { "isSuccess": false, "code": 3004, "message":"비밀번호는 6~15자리를 입력해주세요" },
    
    REGISTER_NICKNAME_EMPTY : { "isSuccess": false, "code": 3005, "message":"닉네임을 입력해주세요" },
    REGISTER_NICKNAME_LENGTH : { "isSuccess": false, "code": 3006, "message":"닉네임은 2~6자리를 입력해주세요" },
    REGISTER_NICKNAME_REDUNDANT : { "isSuccess": false, "code": 3007, "message":"이미 존재하는 닉네임입니다." },
    
    REGISTER_PHONE_EMPTY : { "isSuccess": false, "code": 3008, "message":"전화번호를 입력해주세요(-제외)" },
    REGISTER_PHONE_ERROR_TYPE_HYPHEN : { "isSuccess": false, "code": 3009, "message":"-를 제외하고 입력해주세요" }, //형식 
    REGISTER_PHONE_INVALID_VALUE : { "isSuccess": false, "code": 3010, "message":"올바르지 않은 전화번호입니다." }, //값 
    
    LOGIN_ID_WRONG : { "isSuccess": false, "code": 3011, "message": "존재하지 않는 아이디입니다." },
    LOGIN_PW_WRONG : { "isSuccess": false, "code": 3012, "message": "비밀번호가 잘못되었습니다." },


    MODI_OLD_PW_EMPTY : { "isSuccess": false, "code": 3014, "message": "기존 비밀번호를 입력해주세요." },
    MODI_NEW_PW_EMPTY : { "isSuccess": false, "code": 3015, "message": "새 비밀번호를 입력해주세요." },
    MODI_CHECK_PW_EMPTY : { "isSuccess": false, "code": 3016, "message": "새 비밀번호 확인을 입력해주세요." },
    MODI_NEW_NICKNAME_EMPTY : { "isSuccess": false, "code": 3017, "message": "새로운 닉네임을 입력해주세요." },
    MODI_NEW_PHONE_EMPTY : { "isSuccess": false, "code": 3018, "message": "새로운 전화번호를 입력해주세요.(-제외)" },

    UNREGISTER_PW_EMPTY : { "isSuccess": false, "code": 3019, "message": "탈퇴확인을 위해 비밀번호를 입력해주세요." },
    UNREGISTER_PW_WRONG : { "isSuccess": false, "code": 3020, "message": "일치하지 않는 비밀번호입니다." },

    DATE_INVALID_VALUE : { "isSuccess": false, "code": 3021, "message": "유효하지 않는 날짜입니다." }, //값
    USERID_NOT_MATCH : { "isSuccess": false, "code": 3022, "message": "유효하지 않은 userIdx가 입력되었습니다." },
    USERID_EMPTY : { "isSuccess": false, "code": 3023, "message": "userIdx가 입력되어야 합니다." },
    // WEEKLY_OOTD_EMPTY : { "isSuccess": false, "code": 3024, "message": "근 일주일간 OOTD가 존재하지 않습니다." },
    DATE_OOTD_EMPTY : { "isSuccess": false, "code": 3025, "message": "입력된 Date의 OOTD가 존재하지 않습니다." },


    DATE_EMPTY : { "isSuccess": false, "code": 3026, "message": "date값을 입력해야 합니다." },
    PWW_INVALID_VALUE : { "isSuccess": false, "code": 3027, "message": "유효하지 않은 PWW flag(0,1,2)값이 입력되었습니다." }, //값
    
    
    QUERY_STRING_EMPTY : { "isSuccess": false, "code": 3028, "message": "Query String을 입력해야 합니다." },
    PWWC_BLANK_TEXT : { "isSuccess": false, "code": 3029, "message": "공백문자만으로는 새로운 태그를 추가할 수 없습니다." },
    CLOTHES_INVALID_VALUE : { "isSuccess": false, "code": 3030, "message": "올바르지 않은 Clothes flag(0,1,2,3)값이 입력되었습니다." },//값        
    
    
    LOOKPOINT_INVALID_VALUE : { "isSuccess": false, "code": 3031, "message": "lookpoint 범위 내의 값이 아닙니다." }, //값
    LOOKPOTNT_EMPTY : { "isSuccess": false, "code": 3032, "message": "lookpoint값을 입력해야 합니다." },
    // PWWC_ERROR_TYPE: { "isSuccess": false, "code": 3033, "message": "Place, Weather, Who, Color에 해당하지 않는 검색입니다." }, //검색초기화면 

    HISTORY_INACTIVE : { "isSuccess": false, "code": 3034, "message": "삭제된 History입니다." },
    HISTORY_INDEX_ERROR : { "isSuccess": false, "code": 3035, "message": "회원 상태값을 입력해주세요" },

    
    PWWC_INVALID_VALUE : { "isSuccess": false, "code": 3036, "message": "유효하지 않은 PWWC flag(0,1,2,3) 값이 입력되었습니다." }, //값
    FLAG_EMPTY : { "isSuccess": false, "code": 3037, "message": "Query String에 flag를 입력해야 합니다." },
    KEYWORD1_EMPTY : { "isSuccess": false, "code": 3038, "message": "keyword1 Query String을 입력해야 합니다." },
    STARTAT_EMPTY : { "isSuccess": false, "code": 3039, "message": "startAt Query String을 입력해야 합니다." },
    ENDAT_EMPTY : { "isSuccess": false, "code": 3040, "message": "endAt Query String을 입력해야 합니다." },


    //New added
    REGISTER_NAME_EMPTY : { "isSuccess": false, "code": 3041, "message":"이름을 입력해주세요." },
    QUERY_STRING_OVERFLOW : { "isSuccess": false, "code": 3042, "message": "너무 많은 Query String이 입력되었습니다." },
    QUERY_STRING_ERROR_TYPE : { "isSuccess": false, "code": 3043, "message": "올바르지 않은 Query String 형식이 입력되었습니다." },
    DATE_ERROR_TYPE : { "isSuccess": false, "code": 3044, "message": "올바르지 않는 날짜형식입니다." }, //형식
    PWW_ERROR_TYPE : { "isSuccess": false, "code": 3045, "message": "올바르지 않은 PWW flag형식이 입력되었습니다." }, //형식
    CLOTHES_ERROR_TYPE : { "isSuccess": false, "code": 3046, "message": "올바르지 않은 Clothes형식이 입력되었습니다." }, //형식
    LOOKPOINT_ERROR_TYPE : { "isSuccess": false, "code": 3047, "message": "올바르지 않은 lookpoint 형식이 입력되었습니다." }, //형식
    PWWC_ERROR_TYPE : { "isSuccess": false, "code": 3048, "message": "올바르지 않은 PWWC flag형식이 입력되었습니다." }, //형식
    TAG_LENGTH : { "isSuccess": false, "code": 3049, "message": "태그의 내용은 6글자까지만 입력할 수 있습니다." }, //형식
    REGISTER_BLANK_ALL : { "isSuccess": false, "code": 3050, "message": "공백만 입력되었습니다." },
    REGISTER_BLANK_TEXT : { "isSuccess": false, "code": 3051, "message": "공백이 입력되었습니다." },
    LOOKNAME_EMPTY : {"isSuccess" : false, "code" : 3052, "message" : "LOOKNAME을 입력해주세요."},
    LOOKNAME_LENGTH : {"isSuccess" : false, "code" : 3053, "message" : "LOOKNAME을 27자리 이내로 입력해주세요."},
    PHOTOIS_EMPTY : {"isSuccess" : false, "code" : 3054, "message" : "PhotoIs 값을 입력해주세요."},
    PHOTOIS_ERROR_TYPE : {"isSuccess" : false, "code" : 3055, "message" : "올바르지 않은 PhotoIs 형식입니다."},
    PHOTOIS_INVALID_VALUE : {"isSuccess" : false, "code" : 3056, "message" : "유효하지 않은 PhotoIs 값이 입력되었습니다."},
    IMAGE_INVALID_VALUE : {"isSuccess" : false, "code" : 3057, "message" : "유효하지 않은 이미지URL이 입력되었습니다."},
    THUMBNAIL_ERROR_TYPE :  {"isSuccess" : false, "code" : 3058, "message" : "올바르지 않은 thumbnail 형식입니다."},
    THUMBNAIL_INVALID_VALUE : {"isSuccess" : false, "code" : 3059, "message" : "유효하지 않은 thumbnail 값이 입력되었습니다."},
    BIG_CLASS_NOT_MATCH : {"isSuccess" : false, "code" : 3060, "message" : "존재하지 않는 옷 카테고리입니다."},
    COLOR_INVALID_VALUE : {"isSuccess" : false, "code" : 3061, "message" : "유효하지 않은 COLOR값이 입력되었습니다."},
    COMMENT_LENGTH :  {"isSuccess" : false, "code" : 3062, "message" : "COMMENT를 65535자리 이내로 입력해주세요."},
    FCLOTHES_ERROR_TYPE : {"isSuccess" : false, "code" : 3063, "message" : "올바르지 않은 fixedClothes index 형식입니다."},
    FCLOTHES_INDEX_EMPTY : {"isSuccess" : false, "code" : 3064, "message" : "fClothes의 index 값을 입력해주세요."},
    FCLOTHES_COLOR_EMPTY : {"isSuccess" : false, "code" : 3065, "message" : "fClothes의 color 값을 입력해주세요."},
    FPLACE_ERROR_TYPE : {"isSuccess" : false, "code" : 3066, "message" : "올바르지 않은 장소 index 형식입니다."},
    FWEATHER_ERROR_TYPE : {"isSuccess" : false, "code" : 3067, "message" : "올바르지 않은 날씨 index 형식입니다."},
    FWHO_ERROR_TYPE : {"isSuccess" : false, "code" : 3068, "message" : "올바르지 않은 누구 index 형식입니다."},
    ACLOTHES_BIG_EMPTY : {"isSuccess" : false, "code" : 3069, "message" : "aClass의 bigClass 값을 입력해주세요."},
    ACLOTHES_SMALL_EMPTY : {"isSuccess" : false, "code" : 3070, "message" : "aClass의 smallClass 값을 입력해주세요."},
    CLOTHES_PWW_ONE_EMPTY : {"isSuccess" : false, "code" : 3071, "message" : "Query String에 Clothes와 PWW를 모두 입력해야 합니다."},
    REGISTER_NAME_REGEXP : {"isSuccess" : false, "code" : 3072, "message" : "성함은 한글(2-5자), 영문 대 소문자(2-10)자를 입력하세요."},
    REGISTER_NICKNAME_REGEXP : {"isSuccess" : false, "code" : 3073, "message" : "특수문자를 제외하고 입력하세요."},
    REGISTER_ID_REGEXP : {"isSuccess" : false, "code" : 3074, "message" : "아이디는 영문자로 시작하는 6~15자 영문자 또는 숫자이어야 합니다."},
    REGISTER_IMAGE_EMPTY : {"isSuccess" : false, "code" : 3075, "message" : "Image 관련 값을 입력해주세요."},
    REGISTER_CLOTHES_EMPTY : {"isSuccess" : false, "code" : 3076, "message" : "선택된 Clothes가 없습니다."},
    REGISTER_PLACE_EMPTY : {"isSuccess" : false, "code" : 3077, "message" : "Place 값을 입력해주세요."},
    REGISTER_WEATHER_EMPTY : {"isSuccess" : false, "code" : 3078, "message" : "Weather 값을 입력해주세요."},
    REGISTER_WHO_EMPTY : {"isSuccess" : false, "code" : 3079, "message" : "Who 값을 입력해주세요."},
    REGISTER_PW_REGEXP : {"isSuccess" : false, "code" : 3080, "message" : "비밀번호는 영문자로 시작하는 6~15자 영문자 또는 숫자여야 합니다."},
    IMAGE_ERROR_TYPE : {"isSuccess" : false, "code" : 3081, "message" : "올바르지 않은 Image 입력 형식입니다."},
    REGISTER_IMGURL_EMPTY : {"isSuccess" : false, "code" : 3082, "message" : "ImageUrl 값을 입력해주세요"},
    REGISTER_THUMBNAIL_EMPTY : {"isSuccess" : false, "code" : 3083, "message" : "Thumbnail 값을 입력해주세요."},
    REGISTER_FCLOTHES_EMPTY : {"isSuccess" : false, "code" : 3084, "message" : "fClothes 값을 입력해주세요."},
    REGISTER_FCLOTHES_ERROR_TYPE : {"isSuccess" : false, "code" : 3085, "message" : "올바르지 않은 fClothes 형식입니다."},
    REGISTER_ACLOTHES_EMPTY : {"isSuccess" : false, "code" : 3086, "message" : "aClothes 값을 입력해주세요."},
    REGISTER_ACLOTHES_ERROR_TYPE : {"isSuccess" : false, "code" : 3087, "message" : "올바르지 않은 aClothes 형식입니다."},
    ACLOTHES_COLOR_EMPTY : {"isSuccess" : false, "code" : 3088, "message" : "aClothes의 color 값을 입력해주세요."},
    REGISTER_PLACE_ERROR_TYPE : {"isSuccess" : false, "code" : 3089, "message" : "올바르지 않은 fPlace / aPlace 입력 형식입니다."},
    REGISTER_WEATHER_ERROR_TYPE : {"isSuccess" : false, "code" : 3090, "message" : "올바르지 않은 fWeather / aWeather 입력 형식입니다."},
    REGISTER_WHO_ERROR_TYPE : {"isSuccess" : false, "code" : 3091, "message" : "올바르지 않은 fWho / aWho 입력 형식입니다."},
    REGISTER_COMMENT_EMPTY : {"isSuccess" : false, "code" : 3092, "message" : "COMMENT 값을 입력해주세요."},
    THUMBNAIL_MANY_MAIN : {"isSuccess" : false, "code" : 3093, "message" : "한 개의 사진이 thumbnail로 지정되어야 합니다."},
    MODE_EMPTY : {"isSuccess" : false, "code" : 3094, "message" : "Query String에 mode를 입력해야 합니다."},
    MODE_ERROR_TYPE : {"isSuccess" : false, "code" : 3095, "message" : "올바르지 않은 mode Query String 형식입니다."},
    MODE_INVALID_VALUE : {"isSuccess" : false, "code" : 3096, "message" : "유효하지 않은 mode Query String(1,2)값이 입력되었습니다."},
    REGISTER_PLACE_MAX : {"isSuccess" : false, "code" : 3097, "message" : "Place는 최대 두 개까지 선택할 수 있습니다."},
    REGISTER_WEATHER_MAX : {"isSuccess" : false, "code" : 3098, "message" : "Weather는 최대 두 개까지 선택할 수 있습니다."},
    REGISTER_WHO_MAX : {"isSuccess" : false, "code" : 3099, "message" : "Who는 최대 두 개까지 선택할 수 있습니다."},
    REGISTER_IMAGE_OBJ : {"isSuccess" : false, "code" : 3100, "message" : "Image 배열 내 하나 이상의 값이 있어야 합니다."},



    PWWC_EMPTY :  {"isSuccess" : false, "code" : 3101, "message" : "PWWC flag 값이 입력되어야합니다."},
    HISTORY_CONTENT_UNDEFINED :  {"isSuccess" : false, "code" : 3102, "message" : "삭제할 블럭이 지정되지 않았습니다."},
    UNNECESSARY_CONTENT :  {"isSuccess" : false, "code" : 3103, "message" : "전체삭제에 알맞지 않은 조건입니다."},
    QUERY_STRING_INVALID_VALUE :  {"isSuccess" : false, "code" : 3105, "message" : "유효하지 않은 Query String 값이 입력되었습니다."},
    STARTAT_ERROR_TYPE :  {"isSuccess" : false, "code" : 3106, "message" : "올바르지 않은 startAt 형식이 입력되었습니다."},
    STARTAT_INVALID_VALUE :  {"isSuccess" : false, "code" : 3107, "message" : "유효하지 않은 startAt 값이 입력되었습니다."},
    ENDAT_ERROR_TYPE :  {"isSuccess" : false, "code" : 3108, "message" : "올바르지 않은 endAt 형식이 입력되었습니다."},
    ENDAT_INVALID_VALUE :  {"isSuccess" : false, "code" : 3109, "message" : "유효하지 않은 endAt 값이 입력되었습니다."},
    SEARCH_KEYWORD_LENGTH :  {"isSuccess" : false, "code" : 3110, "message" : "6자 이내로 검색해야 합니다."},
    TAG_EMPTY :  {"isSuccess" : false, "code" : 3111, "message" : "태그 내용을 입력해야 합니다."},
    COLOR1_EMPTY : {"isSuccess" : false, "code" : 3112, "message" : "color1 값이 입력되어야 합니다."},
    COLOR2_EMPTY : {"isSuccess" : false, "code" : 3113, "message" : "keyword2에 해당하는 color2 값이 입력되어야 합니다."},
    KEYWORD2_EMPTY : {"isSuccess" : false, "code" : 3114, "message" : "color2에 해당하는 keyword2값이 입력되어야 합니다."},
    COLOR2_INVALID_VALUE : {"isSuccess" : false, "code" : 3115, "message" : "color2에 유효하지 않은 COLOR값이 입력되었습니다."},
    REGISTER_NEW_PW_LENGTH : { "isSuccess" : false, "code" : 3116, "message" : "새비밀번호는 6~15자리를 입력해주세요" },
    REGISTER_CHECK_PW_LENGTH : { "isSuccess" : false, "code" : 3117, "message" : "새비밀번호확인은 6~15자리를 입력해주세요" },
    UNNECESSARY_COLOR : { "isSuccess" : false, "code" : 3118, "message" : "color는 Place/Weather/Who 검색에 알맞지 않은 조건입니다." },
    REGISTER_BIRTHDAY_EMPTY : { "isSuccess" : false, "code" : 3119, "message" : "생년월일을 입력해주세요." },
    REGISTER_BIRTHDAY_ERROR_TYPE : { "isSuccess" : false, "code" : 3120, "message" : "올바르지 않은 생년월일 형식입니다." },
    REGISTER_BIRTHDAY_INVALID_VALUE : { "isSuccess" : false, "code" : 3121, "message": "유효하지 않은 생년월일입니다." },
    REGISTER_GENDER_EMPTY : { "isSuccess" : false, "code" : 3122, "message" : "성별을 입력해주세요." },
    REGISTER_GENDER_ERROR_TYPE : { "isSuccess" : false, "code" : 3123, "message" : "올바르지 않은 성별 형식입니다." },
    REGISTER_GENDER_INVALID_VALUE : { "isSuccess" : false, "code" : 3124, "message": "유효하지 않은 성별입니다." },
    
    

    

    //Response Error
    LOOKPOINT_RESPONSE_ERROR : { "isSuccess": false, "code": 4000, "message": "LOOKPOINT 값 추출에 실패했습니다."},
    SEARCH_DATE_OOTD_EMPTY : { "isSuccess": false, "code": 4001, "message": "선택하신 날짜에 해당하는 OOTD가 존재하지 않습니다." },
    LOGIN_UNREGISTER_USER : { "isSuccess": false, "code": 4002, "message": "탈퇴된 계정입니다. 문의해주세요." },
    TAG_OVERFLOW : { "isSuccess": false, "code": 4003, "message": "태그는 최대 20개까지 추가할 수 있습니다." },
    TAG_REDUNDANT : { "isSuccess": false, "code": 4004, "message": "이미 존재하는 태그입니다." }, 
    DATE_RESPONSE_ERROR : { "isSuccess":false, "code":4005, "message": "DATE 값 추출에 실패했습니다."},    
    TAG_ALREADY_DELETED : { "isSuccess":false, "code":4006, "message": "이미 삭제된 태그입니다."},
    TAG_NEVER_EXISTED : { "isSuccess":false, "code":4007, "message": "추가된 적이 없는 태그입니다."},
    OOTD_DELETION_RESPONSE_ERROR : { "isSuccess": false, "code": 4008, "message": "OOTD 삭제에 실패했습니다."},
    OOTD_ALREADY_EXIST : { "isSuccess": false, "code": 4009, "message": "해당 DATE에 이미 OOTD가 존재합니다."},
    CLOTHES_NOT_MATCH : { "isSuccess": false, "code": 4010, "message": "등록할 수 없는 옷이 입력되었습니다."},
    PLACE_NOT_MATCH : { "isSuccess": false, "code": 4011, "message": "등록할 수 없는 Place가 입력되었습니다."},
    WEATHER_NOT_MATCH : { "isSuccess": false, "code": 4012, "message": "등록할 수 없는 Weather가 입력되었습니다."},
    WHO_NOT_MATCH : { "isSuccess": false, "code": 4013, "message": "등록할 수 없는 Who가 입력되었습니다."},
    TAG_REDUNDANT_FIXED : { "isSuccess": false, "code": 4014, "message": "기본 태그에 존재합니다." },
    OOTD_NOT_EXIST :  { "isSuccess": false, "code": 4015, "message": "해당 DATE에 OOTD가 존재하지 않습니다." },
    SEARCH_NOT_EXIST : { "isSuccess": false, "code": 4016, "message": "존재하지 않는 검색 내역입니다." },
    HISTORY_DELETED : { "isSuccess": false, "code": 4017, "message": "삭제된 History입니다." },
    SEARCH_NOT_FOUND : { "isSuccess": false, "code": 4018, "message": "검색결과를 찾을 수 없습니다." },
    SEARCH_TAG_NOT_EXIST : { "isSuccess": false, "code": 4019, "message": "해당 키워드를 포함하는 태그가 존재하지 않습니다." },
    PRINT_IMG_ERROR : { "isSuccess": false, "code": 4020, "message": "Thumbnail 사진 및 저장된 사진의 개수 출력에 문제가 있습니다." },    
    HISTORY_HANDLING_ERROR : { "isSuccess": false, "code": 4021, "message": "History 삭제 및 추가에 실패했습니다." },
    USER_NOT_EXIST : { "isSuccess": false, "code": 4022, "message": "존재하지 않는 사용자입니다." },
    

    

    //Connection Error
    DB_ERROR : { "isSuccess": false, "code": 5000, "message": "DB 접속 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 6000, "message": "SERVER 에러"},
    S3_ERROR : {"isSuccess": false, "code": 7000, "message": "S3 에러"},
}