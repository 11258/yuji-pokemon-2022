import { findTrainer, findTrainers } from "./trainer.js";

async function TEST() {
    const test = await findTrainer("red");
    console.log(test)
}

async function TEST2() {
    const test = await findTrainers();
    console.log(test)
}
TEST();
