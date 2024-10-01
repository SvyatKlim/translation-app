<template>
  <main class="main">
    <section class="input-words">
      <div class="input-wrapper">
        <Textarea v-model="textInput" rows="6" autoResize cols="30" placeholder="Enter your text here"/>
      </div>
      <Button label="Translate" @click="translateAndSave"/>
    </section>
    <div v-if="translatedText">
      <h3>Translation:</h3>
      <p>{{ translatedText }}</p>
      <Button label="Listen" @click="playAudio"/>
    </div>
  </main>
</template>

<script setup>
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import {ref} from 'vue';
import {db} from '../firebase';
import {collection, addDoc} from "firebase/firestore";

const textInput = ref('');
const translatedText = ref('');

async function translateText(text, targetLang) {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: targetLang === 'en' ? 'ru' : 'en',
      target: targetLang,
    }),
    headers: {'Content-Type': 'application/json'},
  });
  const result = await response.json();
  return result.translatedText;
}

function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'ru-RU';
  window.speechSynthesis.speak(utterance);
}

const translateAndSave = async (ev) => {
  console.log(textInput.value)
  if (textInput.value.trim().length > 0) {
    const targetLang = /^[а-яА-Я]/.test(textInput.value) ? 'en' : 'ru';
    translatedText.value = await translateText(textInput.value, targetLang);

    // Save to Firebase
    await addDoc(collection(db, targetLang === 'en' ? 'english-to-russian' : 'russian-to-english'), {
      original: textInput.value,
      translated: translatedText.value,
    });
  }
};

const playAudio = () => {
  speakText(translatedText.value, /^[а-яА-Я]/.test(textInput.value) ? 'en' : 'ru');
};
</script>
<style scoped>
.main {
  max-width: 800px;
  width: 100%;
  height: fit-content;

  .input-words {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid var(--color-text);
  }

  .input-wrapper {
    margin-bottom: 10px;
  }

  textarea {
    resize: none;
    width: 100%;
  }
}
</style>