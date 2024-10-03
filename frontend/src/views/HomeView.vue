<template>
  <main class="main">
    <section class="input-words">
      <div class="input-wrapper">
        <Textarea v-model="textInput" rows="6" autoResize cols="30" placeholder="Enter your text here"/>
      </div>
      <Button label="Translate" @click="processWords"/>
      <div v-if="loading">Translate in progress, please wait...</div>
    </section>
    <section class="translations" v-if="words.length > 0">
      <h3>Translation:</h3>
      <ul>
        <li v-for="(word, index) in words" :key="index">
          {{ word.english }} - {{ word.russian }}
        </li>
      </ul>
      <Button class="translations-btn" label="Listen" @click="speakWords"/>
    </section>
  </main>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import {getFirestore, collection, getDocs, addDoc} from 'firebase/firestore';
import {db} from '../firebase';
import axios from 'axios';

const words = ref([]);
const textInput = ref('');
const translatedWords = ref([]);
const loading = ref(false);
const apiKey = import.meta.env.VITE_DEEPL_API_KEY;

const fetchWords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'words'));
    words.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error('Error fetching words:', error);
  }
};

const speakWords = () => {
  words.value.forEach(word => {
    const englishMsg = new SpeechSynthesisUtterance(word.english);
    englishMsg.lang = 'en-US';
    window.speechSynthesis.speak(englishMsg);

    const russianMsg = new SpeechSynthesisUtterance(word.russian);
    russianMsg.lang = 'ru-RU';
    window.speechSynthesis.speak(russianMsg);
  });
};

const processWords = async () => {
  if (!textInput.value.trim()) return;

  const wordsArray = textInput.value.split(/\s+/).slice(0, 100);
  loading.value = true;

  for (const word of wordsArray) {
    try {
      const response = await axios.post('http://localhost:3000/translate', {
        text: word,
        target_lang: 'RU'
      });

      const translatedWord = {
        english: word,
        russian: response.data.translation
      };

      // Сохранение в Firebase
      await addDoc(collection(db, 'words'), translatedWord);
      translatedWords.value.push(translatedWord);
      await fetchWords();
    } catch (error) {
      console.error(`Ошибка при переводе слова "${word}":`, error);
    }
  }

  textInput.value = '';
  loading.value = false;
};



// Загружаем слова при монтировании компонента
onMounted(() => {
  fetchWords();
});
</script>

<style scoped>
.main {
  max-width: 800px;
  width: 100%;
  height: fit-content;

  section {
    margin-bottom: 60px;
  }

  button {
    min-width: 90px;
    display: flex;
    justify-content: center;
  }

  textarea {
    resize: none;
    width: 100%;
  }

  .input-words {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid var(--color-text);
  }

  .input-wrapper {
    margin-bottom: 10px;
  }

  .translations {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 20px;
  }
}
</style>