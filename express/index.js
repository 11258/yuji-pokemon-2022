import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { findTrainers, upsertTrainer, findTrainer, deleteTrainer } from "./utils/trainer";
import { findPokemon } from "./utils/pokemon";
import { mkdir, cp } from "fs/promises";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/pokeapi",
  createProxyMiddleware({
    target: "https://pokeapi.co",
    changeOrigin: true,
    pathRewrite: {
      "^/api/pokeapi": "/api/v2",
    },
  })
);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
app.get("/trainers", async (_req, res, next) => {
  try {
    console.log("Enter trainers...")
    const trainers = await findTrainers();
    console.log(JSON.stringify(trainers))
    // TODO: 期待するレスポンスボディに変更する
    const trainersName = trainers.map(({ Key }) => Key.replace(/\.json$/, ""));
    console.log(trainersName);
    res.send(trainersName);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
app.post("/trainer", async (req, res, next) => {
  try {
    console.log(`Enter [post] /trainer - ${JSON.stringify(req.body)}`)
    // TODO: トレーナー名が含まれていなければ400を返す
    if (req.body.name == "") {
      console.log("400")
      return res.sendStatus(400);
    }
    const trainers = await findTrainers();
    if (trainers.some(({ Key }) => Key === req.body.name + ".json")) {
      console.log("409")
      return res.sendStatus(409);
    }
    // TODO: すでにトレーナーが存在していれば409を返す
    const result = await upsertTrainer(req.body.name, req.body);
    console.log(JSON.stringify(result));
    // /// フォルダの作成
    // await mkdir(`./pages/${req.body.name}`);
    // await cp(`./pages/tmp.vue`, `./pages/${req.body.name}/index.vue`);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装
app.get("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const result = await findTrainer(trainerName); ///////////////
    console.log(`FindTrainer result - ${JSON.stringify(result)}`)
    res.send(result);
  }
  catch (err) {
    next(err);
  }
});

/** トレーナーの更新 */
app.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
app.delete("/trainer/:trainerName",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonId } = req.params;
      const trainer = await findTrainer(trainerName);
      const index = trainer.pokemons.findIndex(
        (pokemon) => String(pokemon.id) === pokemonId
      );
      trainer.pokemons.splice(index, 1);
      const result = await deleteTrainer(trainerName);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  }
);


/** ポケモンの追加 */
app.put(
  "/trainer/:trainerName/pokemon/:pokemonName",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonName } = req.params;
      const trainer = await findTrainer(trainerName);
      const pokemon = await findPokemon(pokemonName);
      // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
      const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  }
);

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

export default app;
