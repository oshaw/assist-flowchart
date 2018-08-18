export const callAPI = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    let serializedBody = '';
    for (const key in body) {
      serializedBody += '&' + key + '=' + body[key];
    }
    fetch('./api?endpoint=' + endpoint + serializedBody).then((response) => {
      if (response.status !== 200) {
        reject(response);
      }
      else {
        response.json().then((json) => {
          resolve(json);
        }).catch(reject);
      }
    }).catch(reject);
  });
}

export const capitalize = (string) => {
  if (string) {
    return string[0].toUpperCase() + string.substring(1);
  }
}

export const AGREEMENT_PAIR_TYPES = Object.freeze({
  singleCourse: 'singleCourse',
  multipleCourses: 'multipleCourses',
  multiplePairs: 'multiplePairs',
  notArticulated: 'notArticulated'
});

export const determineAgreementPairType = (pair) => {
  // Requirement satisfied by single course
  if (pair.course && pair.course.id) {
    return AGREEMENT_PAIR_TYPES.singleCourse;
  }
  // Requirement satisfied by multiple courses
  else if (pair.course && pair.course.relation) {
    return AGREEMENT_PAIR_TYPES.multipleCourses;
  }
  // Requirement gives a choice from a list of requirements
  else if (!pair.course && pair.relation) {
    return AGREEMENT_PAIR_TYPES.multiplePairs;
  }
  // Requirement not articulated
  else {
    return AGREEMENT_PAIR_TYPES.notArticulated;
  }
}