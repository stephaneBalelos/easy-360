<template>
    <div v-if="scenes && scenes.length > 0" class="scene-list-card">
        <div class="scene-list-card-header">
            <h3 class="scene-list-card-body-title">{{ selectedScene?.name }}</h3>
            <button @click="toggleCardBody">{{ showCardBody ? 'close': 'open'}}</button>
        </div>
        <div :class="`scene-list-card-body ${showCardBody ? 'show' : ''}`">
            <ul class="scene-list">
                <li v-for="scene in scenes" @click="() => changeScene(scene.id)" :class="`${scene.id === selectedSceneId ? 'active' : ''}`">
                    {{ scene.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup lang="ts">
import { usePreviewState } from '../composables/usePreviewState';
import { ref } from 'vue';

const { scenes, selectedSceneId, selectedScene } = usePreviewState()

const showCardBody = ref(false)

function changeScene(id: string) {
    selectedSceneId.value = id
    showCardBody.value = false
}

function toggleCardBody() {
    showCardBody.value = !showCardBody.value
}
</script>

<style lang="scss" scoped>
.scene-list-card {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: calc(var(--container-padding) / 2);
    background-color: white;
    color: rgba(var(--color-body) / 1);
    min-width: 200px;
    width: 100%;
    max-width: 400px;

    .scene-list-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .scene-list-card-body-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: .5rem 0;
        }
    }

    .scene-list-card-body {

        max-height: 0px;
        transition: all .3s;
        overflow: hidden;

        &.show {
            max-height: 300px;
        }

        .scene-list {
            list-style: none;
            padding: 0;

            li {
                cursor: pointer;
                border-radius: .25rem;
                margin-bottom: .5rem;
                transition: all .2s ease-in-out;
                padding-top: .5rem;
                padding-bottom: .5rem;

                &.active {
                    color: rgba(var(--color-primary) / 1);
                }

                &:hover {
                    padding: .5rem;
                    background-color: rgba(var(--color-primary) / .1);
                }
            }
        }
    }
}
</style>