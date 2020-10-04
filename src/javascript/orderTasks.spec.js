import fs from "fs";
import { orderTasks } from "./orderTasks";

let { data: tasks } = JSON.parse(fs.readFileSync("data/tasks.json"));

describe("orderTasks()", () => {
  it("should return an empty list", () => {
    const order = orderTasks([], []);

    expect(order).toEqual([]);
  });

  it("should remove a subtask that that isn't part of the task set", () => {
    const order = orderTasks(
      [{ task: "some task", dependencies: [] }],
      ["not given", "some task"]
    );

    expect(order).toEqual(["some task"]);
  });

  it("should return the correct ordering if given single task with no dependencies", () => {
    const order = orderTasks(
      [{ task: "some task", dependencies: [] }],
      ["some task"]
    );

    expect(order).toEqual(["some task"]);
  });

  it("should return the correct ordering if given a single task with one dependency", () => {
    const order = orderTasks(tasks, ["earn money"]);

    expect(order).toEqual(["get out of bed", "earn money"]);
  });

  it("should return the correct ordering if given a single task with two dependencies", () => {
    const order = orderTasks(tasks, ["go to hardware store"]);

    expect(order).toEqual([
      "get out of bed",
      "earn money",
      "go to hardware store",
    ]);
  });

  it("should return the correct ordering if given two tasks with same dependency", () => {
    const order = orderTasks(tasks, ["earn money", "go to hardware store"]);

    expect(order).toEqual([
      "get out of bed",
      "earn money",
      "go to hardware store",
    ]);
  });

  it("should return the correct ordering if given subtasks are unordered", () => {
    const order = orderTasks(tasks, ["go to hardware store", "earn money"]);

    expect(order).toEqual([
      "get out of bed",
      "earn money",
      "go to hardware store",
    ]);
  });

  it("should return a correctly ordered list if given an example with multiple dependencies", () => {
    const order = orderTasks(tasks, [
      "get out of bed",
      "buy supplies",
      "build fence",
    ]);

    expect(order).toEqual([
      "get out of bed",
      "earn money",
      "go to hardware store",
      "buy supplies",
      "go to gas station",
      "buy gas",
      "mow lawn",
      "build fence",
    ]);
  });

  it("should return a correctly ordered list if given an example with multiple dependencies and unordered subtasks", () => {
    const order = orderTasks(tasks, [
      "build fence",
      "buy supplies",
      "get out of bed",
    ]);

    expect(order).toEqual([
      "get out of bed",
      "earn money",
      "go to hardware store",
      "buy supplies",
      "go to gas station",
      "buy gas",
      "mow lawn",
      "build fence",
    ]);
  });
});
