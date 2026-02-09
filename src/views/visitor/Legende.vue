<template>
    <div class="legende">
        <h4>Légende</h4>
        <ul>
            <li>
                <Icon icon="mdi:map-marker" class="marker-icon nouveau" />
                Nouveau
            </li>
            <li>
                <Icon icon="mdi:map-marker" class="marker-icon en_cours" />
                En cours
            </li>
            <li>
                <Icon icon="mdi:map-marker" class="marker-icon terminé" />
                Terminé
            </li>
        </ul>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
.legende {
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    width: 180px;
    position: absolute;
    bottom: 30px;
    left: 30px;

    h4 {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 600;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;

            .marker-icon {
                font-size: 20px;

                &.nouveau {
                    color: red;
                }

                &.en_cours {
                    color: #f59e0b;
                }

                &.terminé {
                    color: #16a34a;
                }
            }
        }
    }
}
</style>
