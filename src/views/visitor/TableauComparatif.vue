<template>
    <span class="toggle flex items-center justify-center" @click="active = !active">
        <Icon :icon="active ? 'mdi:chevron-right' : 'mdi:chevron-left'" width="24" />
    </span>
    <div :class='{
        "tbl relative": true,
        "active": active
    }'>

        <div class="header">
            <h2 class="title">Tableau Recapitulatif</h2>
        </div>

        <div class="recap">
            <div class="grd card-points">
                <div class="grd-icon">
                    <Icon width="28" icon="mdi:chart-scatter-plot" />
                </div>
                <div class="grd-content">
                    <h3 class="grd-title">Points</h3>
                    <span class="nb">6,000,000,000</span>
                </div>
                <div class="grd-trend">
                    <Icon width="18" icon="mdi:trending-up" />
                    <span class="trend-text">+12.5%</span>
                </div>
            </div>

            <div class="grd card-surface">
                <div class="grd-icon">
                    <Icon width="28" icon="mdi:square-outline" />
                </div>
                <div class="grd-content">
                    <h3 class="grd-title">Surface</h3>
                    <span class="nb">1,500 km²</span>
                </div>
                <div class="grd-trend">
                    <Icon width="18" icon="mdi:trending-neutral" />
                    <span class="trend-text">Stable</span>
                </div>
            </div>

            <div class="grd card-progress">
                <div class="grd-icon">
                    <Icon width="28" icon="mdi:progress-check" />
                </div>
                <div class="grd-content">
                    <h3 class="grd-title">Avancement</h3>
                    <span class="nb">78%</span>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="grd-trend positive">
                    <Icon width="18" icon="mdi:clock-fast" />
                    <span class="trend-text">En avance</span>
                </div>
            </div>

            <div class="grd card-budget">
                <div class="grd-icon">
                    <Icon width="28" icon="mdi:currency-eur" />
                </div>
                <div class="grd-content">
                    <h3 class="grd-title">Budget</h3>
                    <span class="nb">€4.2M</span>
                </div>
                <div class="grd-trend negative">
                    <Icon width="18" icon="mdi:alert-circle" />
                    <span class="trend-text">Surveiller</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const active = ref(true)
</script>

<style lang="scss">
$tbl-width: 450px;
$primary-color: #4361ee;
$success-color: #06d6a0;
$warning-color: #ffd166;
$danger-color: #ef476f;
$text-color: #2b2d42;
$light-bg: #f8f9fa;

.tbl {
    padding: 0;
    position: absolute;
    top: $header-heigth;
    right: -$tbl-width;
    width: $tbl-width;
    background-color: $light-bg;
    height: calc(100% - $header-heigth);
    transition: .3s ease;
    box-shadow: -2px 0 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.active {
        right: 0;
        transition: .3s ease;
    }

    .header {
        padding: 24px 24px 16px;
        background: white;
        border-bottom: 1px solid #e9ecef;

        .title {
            font-size: 1.5rem;
            font-weight: 700;
            color: $text-color;
            margin: 0 0 4px 0;
        }

        .subtitle {
            font-size: 0.875rem;
            color: #6c757d;
            margin: 0;
        }
    }

    .recap {
        padding: 20px;
        flex: 1;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 16px;
        overflow-y: auto;

        .grd {
            background-color: white;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid #e9ecef;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .grd-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, rgba(67, 97, 238, 0.1), rgba(67, 97, 238, 0.05));
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;

                svg {
                    color: $primary-color;
                }
            }

            .grd-content {
                flex: 1;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-direction: column;

                // h3 {
                //     align-self: flex-end;
                // }
            }

            .grd-title {
                font-size: 0.875rem;
                font-weight: 600;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 8px 0;
            }

            .nb {
                font-size: 1.75rem;
                font-weight: 700;
                color: $text-color;
                margin-bottom: 12px;
                display: block;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background-color: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
                margin-top: 8px;

                .progress-fill {
                    width: 78%;
                    height: 100%;
                    background: linear-gradient(90deg, $warning-color, #ffb347);
                    border-radius: 3px;
                }
            }

            .grd-trend {
                display: flex;
                align-items: center;
                background-color: red;
                align-self: flex-end;
                gap: 6px;
                font-size: 0.75rem;
                padding: 6px 10px;
                background-color: rgba(67, 97, 238, 0.08);
                border-radius: 20px;
                margin-top: 8px;
                width: fit-content;

                &.positive {
                    background-color: rgba(6, 214, 160, 0.1);
                    color: $success-color;
                }

                &.negative {
                    background-color: rgba(239, 71, 111, 0.1);
                    color: $danger-color;
                }

                .trend-text {
                    font-weight: 600;
                }
            }
        }
    }
}

span.toggle {
    position: absolute;
    right: 10px;
    top: calc($header-heigth + 20px);
    padding: 10px;
    cursor: pointer;
    z-index: 100;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;

    &:hover {
        background-color: $primary-color;
        color: white;
        transform: translateX(-2px);
        box-shadow: 0 6px 16px rgba(67, 97, 238, 0.2);
    }

    &.active {
        right: $tbl-width + 10px;
    }
}
</style>