<template>
    <div class="manager">
        <SignalementsList />
    </div>
</template>

<script setup>
import SignalementsList from './SignalementsList.vue';
</script>

<style lang="scss" scoped>

.manager {
    padding-left: $padding-x;
    padding-right: $padding-x;
}
</style>