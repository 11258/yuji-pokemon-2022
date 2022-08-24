<script>
import GamifyButton from '~~/components/GamifyButton.vue';
import GamifyDialog from '~~/components/GamifyDialog.vue';
import GamifyList from '~~/components/GamifyList.vue';
import GamifyItem from '~~/components/GamifyItem.vue';

import trimAvoidCharacters from '~~/utils/trimAvoidCharacters';
import { VITE_SERVER_ORIGIN } from '~~/utils/env';
export default {
  setup() {
    const router = useRouter();
    const trainerName = ref("");
    const safeTrainerName = computed(() =>
      trimAvoidCharacters(trainerName.value)
    );
    const onSubmit = async () => {
      const response = await fetch(`${VITE_SERVER_ORIGIN}/api/trainer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            name: safeTrainerName.value,
          }
        ),
      });
      if (!response.ok) return;
      router.push(`/trainer/${safeTrainerName.value}`);
    }
    const { dialog, onOpen, onClose } = useDialog();
    return {
      trainerName,
      safeTrainerName,
      dialog,
      onOpen,
      onClose,
      onSubmit
    }
  },
  components: { GamifyButton, GamifyDialog, GamifyList, GamifyItem, GamifyButton, GamifyItem }
};
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>では　はじめに　きみの　なまえを　おしえて　もらおう！</p>
    <form @submit.prevent>
      <div class="item">
        <label for="name">なまえ</label>
        <span id="name-description">
          とくていの　もじは　とりのぞかれるぞ！
        </span>
        <input id="name" @keydown.enter="onOpen(true)" v-model="trainerName" aria-describedby="name-description" />
      </div>
      <!-- <GamifyButton type="button" @click="onSubmit">けってい</GamifyButton> -->
      <GamifyButton @click="onOpen(true)">けってい</GamifyButton>

      <GamifyDialog v-if="dialog" id="confirm-submit" title="かくにん" :description="`ふむ・・・　きみは　${trainerName}　と　いうんだな！`"
        @close="onClose">
        <GamifyList :border="false" direction="horizon">
          <GamifyItem>
            <GamifyButton @click="onClose">いいえ</GamifyButton>
          </GamifyItem>
          <GamifyItem>
            <GamifyButton @click="onSubmit">はい</GamifyButton>
          </GamifyItem>
        </GamifyList>
      </GamifyDialog>

    </form>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form> :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item>label,
.item>span {
  display: block;
  margin-bottom: 0.25rem;
}

.item>span {
  font-size: 0.875rem;
}
</style>
