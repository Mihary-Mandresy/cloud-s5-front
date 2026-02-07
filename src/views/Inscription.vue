<template>
    <div class="login flex min-h-screen">
        <div class="img w-1/2"></div>
        <div class="form-parent grid place-items-center w-1/2">
            <div class="form-card p-4 rounded-2xl">
                <div class="title">
                    <h1 class="text-5xl text-center">Inscription</h1>
                </div>

                <form @submit.prevent="" class="form">

                    <div class="form-group">
                        <span class="libelle">Nom</span>
                        <label for="nom">
                            <Icon width="20" icon="mdi:account-circle" />
                        </label>
                        <input type="text" id="nom">
                    </div>
                    <div class="form-group">
                        <span class="libelle">Date de naissance</span>
                        <label for="dtn">
                            <Icon width="20" icon="mdi:calendar" />
                        </label>
                        <input type="date" id="dtn">
                    </div>
                    <div class="form-group">
                        <span class="libelle">Mot de passe</span>
                        <label for="pwd">
                            <Icon width="20" icon="mdi:password" />
                        </label>
                        <input type="mail" id="pwd">
                    </div>
                    
                    <div class="error">
                        <p class="text-center  text-red-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos perferendis ab eligendi inventore tempora obcaecati rerum quod error itaque impedit?</p>
                    </div>

                    <button class="bg-amber-600 btn btn-log">S'inscrire</button>

                    <div class="meta">
                        <span class="text-center ins">Avez vous déjà
                            un compte? <RouterLink to="/login">Se connecter</RouterLink></span>
                        <div class="ou">
                            <hr>
                            <span>ou</span>
                        </div>

                        <div class="social grid grid-cols-4 place-items-center">
                            <RouterLink>
                                <Icon width="20" icon="mdi:google" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:whatsapp" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:facebook" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:instagram" />
                            </RouterLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';


</script>