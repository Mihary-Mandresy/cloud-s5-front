<template>
    <div class="modif">
        <h1>
            <Icon icon="mdi:pencil-outline" />
            Modification Signalement
        </h1>

        <form @submit.prevent="submitForm">

            <div class="form-group">
                <label>
                    <Icon icon="mdi:format-title" />
                    Titre
                </label>
                <input type="text" v-model="signalement.titre" placeholder="Titre du signalement" />
            </div>

            <div class="form-group">
                <label>
                    <Icon icon="mdi:text" />
                    Description
                </label>
                <textarea v-model="signalement.description" placeholder="Description détaillée"></textarea>
            </div>

            <div class="form-group">
                <label>
                    <Icon icon="mdi:progress-check" />
                    Statut
                </label>
                <select v-model="signalement.status">
                    <option :value="1">En attente</option>
                    <option :value="2">En cours</option>
                    <option :value="3">Résolu</option>
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>
                        <Icon icon="mdi:ruler-square" />
                        Surface (m²)
                    </label>
                    <input type="number" v-model="signalement.surface" placeholder="Surface" />
                </div>
            </div>

            <div class="message" v-if="message">
                <Icon icon="mdi:information-outline" />
                {{ message }}
            </div>

            <button type="submit">
                <Icon icon="mdi:check-circle-outline" />
                Valider
            </button>
        </form>
    </div>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

const message = ref('')

const signalement = reactive({
    titre: "Title",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    status: 1,
    surface: 20,
})

const submitForm = () => {
    message.value = "Signalement modifié avec succès ✅"
    console.log(signalement.value);
    
    console.log(signalement)
}
</script>

<style lang="scss">
.modif {
    max-width: 700px;
    margin: 40px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    h1 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 24px;
        margin-bottom: 25px;
        color: #1f2937;

        svg {
            font-size: 28px;
            color: #2563eb;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-row {
        display: flex;
        gap: 15px;

        .form-group {
            flex: 1;
        }
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            font-weight: 600;
            color: #374151;

            svg {
                color: #2563eb;
            }
        }

        input,
        textarea,
        select {
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            transition: all 0.2s;

            &:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
            }
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }
    }

    .message {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 8px;
        background: #ecfdf5;
        color: #065f46;
        font-size: 14px;

        svg {
            font-size: 18px;
        }
    }

    button {
        margin-top: 10px;
        padding: 12px;
        border-radius: 10px;
        border: none;
        background: #2563eb;
        color: white;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.2s;

        &:hover {
            background: #1d4ed8;
        }
    }
}
</style>