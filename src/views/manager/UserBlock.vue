<template>
    <div class="user h-full">
        <div class="tbl w-full h-full flex items-center justify-center">
            <table border="1">
                <tr>
                    <th>Nom</th>
                    <th>Age</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>

                <tr v-for="(u, index) in dataUser" :key="index">
                    <td>
                        <Icon icon="mdi:account-circle"/>
                        {{ u.name }}
                    </td>
                    <td>{{ u.etat }}</td>
                    <td>
                        <Icon icon="mdi:calendar" />
                        {{ u.date }}
                    </td>
                    <td>
                        <button class="btn" @click="deblocke(u)">
                            <Icon icon="mdi:lock-open"/>
                            Déblocker
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const dataUser = ref([
    { name: "User 1", age: 22, etat: 1, date: "2025-01-10" },
    { name: "User 2", age: 28, etat: 2, date: "2025-01-12" },
    { name: "User 3", age: 31, etat: 1, date: "2025-01-15" },
    { name: "User 4", age: 25, etat: 2, date: "2025-01-18" },
    { name: "User 5", age: 34, etat: 1, date: "2025-01-20" },
    { name: "User 6", age: 29, etat: 2, date: "2025-01-22" },
    { name: "User 7", age: 41, etat: 1, date: "2025-01-25" },
    { name: "User 8", age: 19, etat: 2, date: "2025-01-27" },
    { name: "User 9", age: 36, etat: 1, date: "2025-01-29" },
    { name: "User 10", age: 27, etat: 2, date: "2025-02-01" }
]);

const deblocke = (user) => {
    console.log("deblocke", user);
}

</script>

<style scoped lang="scss">
.user {
    padding-left: $padding-x;
    padding-right: $padding-x;


    .tbl {

        th {
            min-width: 200px;
            background-color: black;
            color: white;
        }

        tr {
            height: 54px;

            &:first-child {
                height: 60px;
            }

            svg.iconify {
                margin-right: 10px;
            }

        }

        td {
            text-align: center;

            .btn {
                padding: 5px 10px;
                background-color: red;
                border-radius: 50px;
                color: white;
                transition: .3s;

                &:hover {
                    background-color: darken($color: red, $amount: 5);
                    transition: .3s;
                }
            }
        }
    }
}
</style>