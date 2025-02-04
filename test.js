import http from 'k6/http';
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
      { duration: '0.3m', target: 500 },
      { duration: '0.4m', target: 500 },
      { duration: '0.6m', target: 1000 },
      { duration: '1m', target: 2000 },
      { duration: '1.4m', target: 0 },
    ],
    thresholds: {
      http_req_failed: ['rate<0.001'], // 
      http_req_duration: ['p(90)<1800'], 
      http_req_receiving: ['max<6000'],
     },
};

export default function () {
    //get all user
    const res_1 = http.get('https://jsonplaceholder.typicode.com/users');
    check(res_1, {
        'verify success response of get all': (res) => res.status === 200,
    });
    //get user by 1
    const res_2 = http.get('https://jsonplaceholder.typicode.com/users/1');
    check(res_2, {
       'verify success response of get by id': (res_2) => res_2.status == 200,
    });
    //add new user
    const payload_1 = JSON.stringify({
        id: 11,
        name: 'tester ar',
        username: 'tester.ar',
        email: 'tester.ar@test.com',
        address: {
          street: 'jl. damai',
          suite: 'Apt. 5',
          city: 'Jaktim',
          zipcode: '12990',
          geo: {
            lat: "-37.3159",
            lng: "81.1496"
            },
        },
        phone: '089876543321',
        website: 'yuhu.org',
        company: {
            name: 'PT Cinta Sejati',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: "harness real-time e-markets"
            }
      });
    const params = {
        headers: {
          'Content-Type': 'application/json'
        },
      };
    const res_3 = http.post('https://jsonplaceholder.typicode.com/users', payload_1, params);
    check(res_3, {
          'verify success response of post': (res_3) => res_3.status == 201,
    });
}
//for generate report
export function handleSummary(data) {
    return {
      "report.html": htmlReport(data),
    };
  }