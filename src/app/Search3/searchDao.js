
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// API 15 : [PWWC] 검색 초기화면 보여주기 - Color 탭
async function selectColorHistory(connection, userIdx, PWWC) {
  const selectColorHistoryQuery = `
                SELECT History.index, content, color
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectColorHistoryQuery, [userIdx, PWWC]);
  return historyRows;
};

// API 15 : [PWWC] 검색 초기화면 보여주기 - Place, Weather, Who 탭
async function selectPWWHistory(connection, userIdx, PWWC) {
  const selectPWWHistoryQuery = `
                SELECT History.index, content
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectPWWHistoryQuery, [userIdx, PWWC]);
  return historyRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Place
async function selectPlaceSuggestion(connection, suggestionKeywordParams) {
  const placeSuggestionQuery = `
                SELECT place
                FROM (SELECT place, createAt
                  FROM FixedPlace fixed
                  UNION
                  SELECT place, createAt
                  FROM AddedPlace added
                  WHERE added.userIdx = ?) AS UP
                WHERE INSTR(place, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(placeSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Weather
async function selectWeatherSuggestion(connection, suggestionKeywordParams) {
  const weatherSuggestionQuery = `
                SELECT weather
                FROM (SELECT weather, createAt
                  FROM FixedWeather fixed
                  UNION
                  SELECT weather, createAt
                  FROM AddedWeather added
                  WHERE added.userIdx = ?) AS UW
                WHERE INSTR(weather, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(weatherSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Who
async function selectWhoSuggestion(connection, suggestionKeywordParams) {
  const whoSuggestionQuery = `
                SELECT who
                FROM (SELECT who, createAt
                  FROM FixedWho fixed
                  UNION
                  SELECT who, createAt
                  FROM AddedWho added
                  WHERE added.userIdx = ?) AS UWH
                WHERE INSTR(who, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(whoSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// API 19 : [PWWC] 매칭 페이지 검색 키워드 제안 - Color
async function selectColorSuggestion(connection, suggestionKeywordParams) {
  const colorSuggestionQuery = `
                SELECT smallClass
                FROM (SELECT smallClass, createAt
                  FROM FixedClothes fixed
                  UNION
                  SELECT smallClass, createAt
                  FROM AddedClothes added
                  WHERE added.userIdx = ?) AS UC
                WHERE INSTR(smallClass, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(colorSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};


module.exports = {
  selectColorHistory,
  selectPWWHistory,
  selectPlaceSuggestion,
  selectWeatherSuggestion,
  selectWhoSuggestion,
  selectColorSuggestion
};
