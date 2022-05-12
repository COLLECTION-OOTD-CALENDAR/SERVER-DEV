
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 6. Monthly 달력 OOTD 부르기
async function selectMonthly(connection, userIdx) {
  const selectMonthlyListQuery = `
                SELECT date, lookpoint
                FROM OOTD
                WHERE userIdx = ? AND status = 'active'
                ORDER BY date;
                `;
  const [monthlyRows] = await connection.query(selectMonthlyListQuery, userIdx);
  return monthlyRows;
};

// 7. Weekly 달력 OOTD 부르기
async function selectWeeklyOotdList(connection, userIdx){
  const selectWeeklyOotdListQuery = `
                  SELECT distinct O.ootdIdx, O.date, O.lookpoint, 
                  TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName, 
                  TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName, 
                  TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall
                  
                  FROM OOTD AS O
                    LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
                      FROM Photo AS Ph
                        RIGHT JOIN OOTD AS O
                          ON Ph.ootdIdx = O.ootdIdx) AS TMPH
                      ON O.ootdIdx = TMPH.ootdIdx
                    LEFT JOIN ( SELECT PL.ootdIdx, PL.fixedPlace, PL.addedPlace, FP.place AS fpName, AP.place AS apName
                      FROM Place as PL
                        LEFT JOIN FixedPlace AS FP
                          ON PL.fixedPlace = FP.index
                        LEFT JOIN AddedPlace AS AP
                          ON PL.addedPlace = AP.index ) AS TMPL
                      ON O.ootdIdx = TMPL.ootdIdx
                    LEFT JOIN ( SELECT WE.ootdIdx, WE.fixedWeather, WE.addedWeather, FW.weather AS fwName, AW.weather AS awName
                      FROM Weather as WE
                        LEFT JOIN FixedWeather AS FW
                          ON WE.fixedWeather = FW.index
                        LEFT JOIN AddedWeather AS AW
                          ON WE.addedWeather = AW.index ) AS TMWE
                      ON O.ootdIdx = TMWE.ootdIdx
                    LEFT JOIN ( SELECT WH.ootdIdx, WH.fixedWho, WH.addedWho, FWH.who AS fwhName, AWH.who AS awhName
                      FROM Who as WH
                        LEFT JOIN FixedWho AS FWH
                            ON WH.fixedWho = FWH.index
                          LEFT JOIN AddedWho AS AWH
                            ON WH.addedWho = AWH.index ) AS TMWH
                      ON O.ootdIdx = TMWH.ootdIdx
                    LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
                      FROM Clothes AS CL
                        LEFT JOIN FixedClothes AS FC
                          ON CL.fixedType = FC.index
                        LEFT JOIN AddedClothes AS AC
                          ON CL.addedType = AC.index ) AS TMCL
                      ON O.ootdIdx = TMCL.ootdIdx
                  WHERE O.userIdx = ? AND O.status = 'active'
                  ORDER BY O.date;
                  `;
  const [weeklyOotdRows] = await connection.query(selectWeeklyOotdListQuery, userIdx);
  return weeklyOotdRows;
};


module.exports = {
  selectMonthly,
  selectWeeklyOotdList,
};
