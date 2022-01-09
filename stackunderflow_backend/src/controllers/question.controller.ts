import { Get, Post, Route } from "tsoa";
import { ValidateRequest, ProcessRequest } from "../services/question/postquestionservice";
import { getTokenFromHeaders } from "../utils/common/getTokenFromHeader";
import { PostAnswerService } from "../services/answer/postanswerservice";
import { getUserPkFromToken } from "../utils/common/getUserPkFromToken";
import { Answers } from "../entities/answer";
import { getAllAnswerForQuestionService } from "../services/answer/getallanswerservice";
import { findQuestionByPk } from "../repositories/question";
import { responseHandler } from "../utils/common/ResponseHandler";
import { UpdateAnswerService } from "../services/answer/updateanswerservice";

@Route("question")
export default class QuestionController {
  @Post("/")
  public async postQuestion(req :any, res :any) {
      try {
        const token = getTokenFromHeaders(req);
        const user = await ValidateRequest({token, questionDetails: req.body["question"]});
        const question = await ProcessRequest({userId: user.pk, questionDetails: req.body["question"]});
        responseHandler(res, {
          message: "Question posted",
          questionId: question.pk
        }, 200);
      } catch (e) {
        responseHandler(res, {
          message: "an error occurred while posting the question"
        }, 500);
      } 
  }

  // req.body.question.question_id, req.body.question.answer
  @Post("/{questionId}/answer")
  public async postAnswer(req: any, res: any) {
      console.log("Inside question controllers!");
      try {
        const answer = req.body["question"];
        const token = getTokenFromHeaders(req);
        const userId: number = getUserPkFromToken(token);
        console.log(answer);
        const  a: Answers = await PostAnswerService({userId: userId, questionId: req.params.questionId, answer: answer["answer"]})
        responseHandler(res, {
          message: "answer posted successfully",
          questionId: answer.questionId,
          answerId: a.pk,
        }, 200);
      } catch (e) {
        responseHandler(res, {
          message: e.message
        }, e.statusCode);
      }
  }

  @Get("/{questionId}/answer/all")
  public async getAllAnswerForQuestion(req :any, res: any) {
    console.log("Inside get all answer for question");
    console.log(req.params.questionId);
    try {
      const questionId: number = req.params.questionId;
      const answers = await getAllAnswerForQuestionService(questionId);
      const questionDetails = await findQuestionByPk(questionId);
      responseHandler(res, {
          question: questionDetails,
          answers: answers.map((ans) => ({ answer: ans.answer }))
        }, 200);
    } catch(e) {
      responseHandler(res, {
        error: e.message
      }, e.statusCode);
    }
  }

  public async updateAnswer(req :any, res :any) {
    console.log("Update the answer for the question");
    try {
      const token = getTokenFromHeaders(req);
      const userId: number = getUserPkFromToken(token);
      await UpdateAnswerService(req.params.questionId, userId, req.body["answer"]);
      responseHandler(res, {
        message: "answer updated successfully"
      }, 200);
    } catch(e) {
      console.log("ooooooooo :", e);
      responseHandler(res, {
        error: e.message
      }, e.statusCode);
    }
  }
}
