<script>
import GamifyButton from "~/components/GamifyButton.vue";
import { VITE_SERVER_ORIGIN } from "~/utils/env";
import trimAvoidCharacters from "~/utils/trimAvoidCharacters";

export default {
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const { data: trainer } = await useAsyncData(
      `/trainer/${route.params.name}`,
      () => $fetch(`${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}`)
    );
    const onDelete = async () => {
      const response = await fetch(
        `${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}`,
        {
          method: "DELETE",
        }
      );
    }
    const nickname = ref("");
    const onNickName = async (pokemon) => {
      const newTrainer = trainer.value;
      const index = newTrainer.pokemon.findIndex(
        ({ id }) => id === pokemon.id
      );
    }
  }
}
</script>

<template>
  <div>
    <h1>トレーナー情報</h1>
    <div class="trainer-info">
      <img src="/avatar.png" />
      <span>{{ trainer.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.item>label {
  display: block;
  margin-bottom: 0.25rem;
}

.gamify-item:hover img {
  animation: bounce;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
}

.trainer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.trainer-info>img {
  width: 3rem;
  height: 3rem;
}
</style>
