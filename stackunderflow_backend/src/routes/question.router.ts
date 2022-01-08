import express from "express";
import QuestionController from "../controllers/question.controller";

const questionRouter = express.Router();

// Route: /question: To ask the question 
questionRouter.post("/", async (req, res) => {
  console.log("Inside question router !");
  console.log(req.body);
  const controller = new QuestionController();
  await controller.postQuestion(req, res);
});

// Route: /question/{questionId}/answer: To answer the question with given question id
questionRouter.post("/:questionid/answer", async (_req, res) => {   
  console.log("Inside question router !");
  console.log(_req.body);
  const controller = new QuestionController();
  await controller.postAnswer(_req.body.question.question_id, _req.body.question.answer);
  
});

// Route: /question/{questionId}: To get answers for all questions


export default questionRouter;