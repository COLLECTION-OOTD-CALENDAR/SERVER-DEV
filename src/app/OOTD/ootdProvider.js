const { pool } = require("../../../config/database");

const ootdDao = require("./ootdDao");




// 입력한 content와의 중복 블럭 여부 체크 (content의 idx 반환)
exports.checkTagRedundancy = async function(userIdx, Clothes, PWW, Content){
  /*    

   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      Content가 smallClass와 같은 것을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       Content가 place/weather/who와 같은 것을 배열에 저장한 후 반환
   */

    const connection = await pool.getConnection(async (conn) => conn);

    if(PWW == -1){
            
      const clothesRedundantListResult = await ootdDao.selectClothesTag(connection, userIdx, Content);
      connection.release();
      return clothesRedundantListResult;
    }
    
    else if (Clothes == -1){
      var flag;
      if(PWW == 0)
        flag = "Place";
      if (PWW == 1)
        flag = "Weather";
      if (PWW == 2)
        flag = "Who";


      const pwwRedundantListResult = await ootdDao.selectPwwTag(connection, userIdx, flag, Content);
      connection.release();

      return pwwRedundantListResult;
    } 
};



// 새로운 블럭 추가 전 개수 체크 (총 개수 반환)
exports.checkTagNumber = async function(userIdx, Clothes, PWW){
  /*
   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      active인 것들을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       active인 것들을 pwwRows에 저장한 후 배열을 반환
   */


    const connection = await pool.getConnection(async (conn) => conn);
    
    if(PWW == -1){
      var flag;//undefined
      if(Clothes == 0) 
          flag = "Top";
      
      else if(Clothes == 1) 
          flag = "Bottom";
  
      else if(Clothes == 2) 
          flag = "Shoes";
      else if(Clothes == 3) 
          flag = "Etc"; 
      
      const clothesNumberListResult = await ootdDao.selectClothesNumber(connection, userIdx, flag);
      connection.release();
      
      return clothesNumberListResult;
    }

    else if (Clothes == -1){
      var flag;
      if(PWW == 0)
        flag = "Place";
      if (PWW == 1)
        flag = "Weather";
      if (PWW == 2)
        flag = "Who";

      
      const pwwNumberListResult = await ootdDao.selectPwwNumber(connection, userIdx, flag);
      connection.release();

      return pwwNumberListResult;
    }

};



// 블럭 삭제하기 전 존재하는 블럭인지 체크 (블럭의 idx반환)
exports.checkTagExistence = async function(userIdx, Clothes, PWW, Content){
  const connection = await pool.getConnection(async (conn) => conn);

  if(PWW == -1){
    var flag;//undefined
    if(Clothes == 0) 
        flag = "Top";
    
    else if(Clothes == 1) 
        flag = "Bottom";

    else if(Clothes == 2) 
        flag = "Shoes";
    else if(Clothes == 3) 
        flag = "Etc"; 
    
    
    const clothesExistListResult = await ootdDao.selectClothesExist(connection, userIdx, flag, Content);
    connection.release();

    return clothesExistListResult;
  }
  
  else if (Clothes == -1){
    var flag;
    if(PWW == 0)
      flag = "Place";
    if (PWW == 1)
      flag = "Weather";
    if (PWW == 2)
      flag = "Who";


    const pwwExistListResult = await ootdDao.selectPwwExist(connection, userIdx, flag, Content);
    connection.release();

    return pwwExistListResult;
  } 


}


// OOTD 삭제하기 전 존재하는 OOTD인지 체크 (ootd의 idx반환)
exports.checkOotdExistence = async function(userIdx, date){

  const connection = await pool.getConnection(async (conn) => conn);      
  const selectOotdExistParams = [userIdx, date, "active"];
  const ootdExistListResult = await ootdDao.selectOotdExist(connection, selectOotdExistParams);
  connection.release();

  return ootdExistListResult[0];
  
}




// 새로운 블럭 추가 전 기본 블럭에 존재하는 블럭인지 체크 (idx 반환)
exports.checkFixedRedundancy = async function(Clothes, PWW, Content){
  /*    

   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      Content가 smallClass와 같은 것을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       Content가 place/weather/who와 같은 것을 배열에 저장한 후 반환
   */

    const connection = await pool.getConnection(async (conn) => conn);

    if(PWW == -1){
            
      const fixedClothesRedundantListResult = await ootdDao.selectFixedClothesTag(connection, Content);
      connection.release();
      return fixedClothesRedundantListResult;
    }
    
    else if (Clothes == -1){
      var pwwflag;
      if(PWW == 0)
        pwwflag = "Place";
      if (PWW == 1)
        pwwflag = "Weather";
      if (PWW == 2)
        pwwflag = "Who";


      const fixedPwwRedundantListResult = await ootdDao.selectFixedPwwTag(connection, pwwflag, Content);
      connection.release();

      return fixedPwwRedundantListResult;
    } 
};
