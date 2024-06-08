const http = require("http");
const fs = require("fs");
const { json } = require("stream/consumers");
const { error } = require("console");

let student = JSON.parse(fs.readFileSync("./student.json"));
let course = JSON.parse(fs.readFileSync("./course.json"));
let department = JSON.parse(fs.readFileSync("./department.json"));

const server = http.createServer((req, res) => {
  let { url, method } = req;
  let body = "";
  let newJsonData = "";
  let id = 0;
  let trueFalseCondition = false;
  const sendResponse = (code, message) => {
    res.statusCode = code;
    res.end(JSON.stringify(message));
  };
  res.setHeader("Content-Type", "application/json");
  if (url.startsWith("/student")) {
    if (method === "GET" && url == "/studentAllDataRelated") {
      let newJsonData = student.map((stu) => {
        const dep = department.find((dep) => dep.Id == stu.DepartmentId);
        const crs = course.filter(
          (crs) => crs.DepartmentId == dep.DepartmentId
        );
        return {
          stu,
          Department: dep,
          Course: crs,
        };
      });
      sendResponse(200, newJsonData);
    } else if (method === "GET" && url.startsWith("/studentSearch")) {
      id = parseInt(url.split("/")[2]);
       trueFalseCondition = student.findIndex((stu) => {
         return stu.Id == id;
       });
      if (trueFalseCondition) {
        console.log(trueFalseCondition);
        sendResponse(200, student[trueFalseCondition]);
      } else {
          sendResponse(400, { error: "id not define" });
          };
    } else if (method === "GET") {
      sendResponse(200, student);
    } else if (method === "POST") {
      req.on("data", (chank) => {
        body = chank;
      });
      req.on("end", () => {
        console.log(body);
        newJsonData = JSON.parse(body);
        trueFalseCondition = student.find(
          (stu) => newJsonData.Email == stu.Email
        );
        if (trueFalseCondition) {
          sendResponse(400, { error: "email is already exist" });
        } else {
          newJsonData.id = student.length + 1;
          student.push(newJsonData);
          fs.writeFileSync("./student.json", JSON.stringify(student));
          sendResponse(201, newJsonData);
        }
      });
    } else if (method === "PUT") {
      id = parseInt(url.split("/")[2]);
      req.on("data", (chank) => {
        newJsonData = JSON.parse(chank);
        trueFalseCondition = student.findIndex((stu) => {
          return stu.Id == id;
        });
        if (trueFalseCondition) {
          student[trueFalseCondition] = {
            ...student[trueFalseCondition],
            ...newJsonData,
          };
          fs.writeFileSync("./student.json", JSON.stringify(student));
          sendResponse(202, newJsonData);
        } else {
          sendResponse(400, { error: "id not define" });
        }
      });
    } else if (method == "DELETE") {
      id = parseInt(url.split("/")[2]);
      trueFalseCondition = student.findIndex((stu) => {
        return stu.Id == id;
      });
      if (trueFalseCondition) {
        student.splice(id - 1, 1);
        fs.writeFileSync("./student.json", JSON.stringify(student));
        sendResponse(204, "accepted");
      } else {
        sendResponse(400, { error: "id not define" });
      }
    }
  } else if (startsWith("/course")) {
    if (method === "GET" && url.startsWith("/courseSearch")) {
      id = parseInt(url.split("/")[2]);
      trueFalseCondition = course.findIndex((crs) => {
        return crs.Id == id;
      });
      if (trueFalseCondition) {
        console.log(trueFalseCondition);
        sendResponse(200, course[trueFalseCondition]);
      } else {
        sendResponse(400, { error: "id not define" });
      }
    }else  if (method == "GET") {
      res.setHeader("Content-Type", "application/json");
      sendResponse(200, course);
    } else if (method === "POST") {
      req.on("data", (chank) => {
        body = chank;
      });
      req.on("end", () => {
        newJsonData = JSON.parse(body);
          newJsonData.id = course.length + 1;
          course.push(newJsonData);
          fs.writeFileSync("./course.json", JSON.stringify(course));
          sendResponse(201, newJsonData);
      });
    } else if (method === "PUT") {
      id = parseInt(url.split("/")[2]);
      req.on("data", (chank) => {
        newJsonData = JSON.parse(chank);
        trueFalseCondition = course.findIndex((crs) => {
          return crs.Id == id;
        });
        if (trueFalseCondition) {
          course[trueFalseCondition] = {
            ...course[trueFalseCondition],
            ...newJsonData,
          };
          fs.writeFileSync("./course.json", JSON.stringify(course));
          sendResponse(202, newJsonData);
        } else {
          sendResponse(400, { error: "id not define" });
        }
      });
    } else if (method == "DELETE") {
      id = parseInt(url.split("/")[2]);
      trueFalseCondition = student.findIndex((crs) => {
        return crs.Id == id;
      });
      if (trueFalseCondition) {
        course.splice(id - 1, 1);
        fs.writeFileSync("./course.json", JSON.stringify(course));
        sendResponse(204, "accepted");
      } else {
        sendResponse(400, { error: "id not define" });
      }
    }
  } else if (url == "/department") {
    if (method === "GET" && url.startsWith("/departmentSearch")) {
      id = parseInt(url.split("/")[2]);
      trueFalseCondition = department.findIndex((dep) => {
        return dep.Id == id;
      });
      if (trueFalseCondition) {
        console.log(trueFalseCondition);
        sendResponse(200, department[trueFalseCondition]);
      } else {
        sendResponse(400, { error: "id not define" });
      }
    } else if (method == "GET") {
      res.setHeader("Content-Type", "application/json");
      sendResponse(200, department);
    } else if (method === "POST") {
      req.on("data", (chank) => {
        body = chank;
      });
      req.on("end", () => {
        newJsonData = JSON.parse(body);
        newJsonData.id = department.length + 1;
        department.push(newJsonData);
        fs.writeFileSync("./department.json", JSON.stringify(department));
        sendResponse(201, newJsonData);
      });
    } else if (method === "PUT") {
      id = parseInt(url.split("/")[2]);
      req.on("data", (chank) => {
        newJsonData = JSON.parse(chank);
        trueFalseCondition = department.findIndex((dep) => {
          return dep.Id == id;
        });
        if (trueFalseCondition) {
          department[trueFalseCondition] = {
            ...department[trueFalseCondition],
            ...newJsonData,
          };
          fs.writeFileSync("./department.json", JSON.stringify(department));
          sendResponse(202, newJsonData);
        } else {
          sendResponse(400, { error: "id not define" });
        }
      });
    } else if (method == "DELETE") {
      id = parseInt(url.split("/")[2]);
      trueFalseCondition = student.findIndex((dep) => {
        return dep.Id == id;
      });
      if (trueFalseCondition) {
        department.splice(id - 1, 1);
        fs.writeFileSync("./department.json", JSON.stringify(department));
        sendResponse(204, "accepted");
      } else {
        sendResponse(400, { error: "id not define" });
      }
    }
  } 
});
let port = 3000;
server.listen(port, () => {
  console.log("port ${port} is ranning");
});
