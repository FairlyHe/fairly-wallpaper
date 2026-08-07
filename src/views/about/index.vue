<script setup>
const repositoryUrl = 'https://github.com/FairlyHe/fairly-wallpaper'
const wallpaperSourceUrl = 'https://wallpaper.360.cn/'

const technologies = [
    {name: 'Vue 3', description: '界面与组件系统', icon: 'icon-code'},
    {name: 'Vite 5', description: '开发与生产构建', icon: 'icon-thunderbolt'},
    {name: 'Arco Design Vue', description: '交互组件与主题', icon: 'icon-apps'},
    {name: 'Vue Router', description: '页面路由管理', icon: 'icon-share-alt'},
    {name: 'Pinia', description: '应用状态管理', icon: 'icon-storage'},
    {name: 'Axios', description: '网络请求封装', icon: 'icon-swap'},
    {name: 'VueUse', description: '组合式工具集', icon: 'icon-tool'},
    {name: 'Less', description: '样式组织与维护', icon: 'icon-palette'},
]
</script>

<template>
    <main class="about-page">
        <section class="intro-section">
            <div class="intro-content">
                <div class="project-mark" aria-hidden="true">
                    <img src="/fox-logo.png" alt="狐狸壁纸 Logo">
                </div>
                <div>
                    <p class="section-label">项目说明</p>
                    <h1>狐狸壁纸</h1>
                    <p class="project-summary">
                        一个基于 Vue 3 构建的壁纸浏览项目，提供分类浏览、分页查看、高清预览与图片下载功能。
                    </p>
                    <a-space wrap>
                        <a-button type="primary" :href="repositoryUrl" target="_blank" rel="noopener noreferrer">
                            <template #icon><icon-github /></template>
                            GitHub 仓库
                        </a-button>
                        <a-button :href="wallpaperSourceUrl" target="_blank" rel="noopener noreferrer">
                            <template #icon><icon-link /></template>
                            图片数据来源
                        </a-button>
                    </a-space>
                </div>
            </div>
        </section>

        <section class="content-section">
            <div class="section-inner">
                <div class="section-heading">
                    <p class="section-label">Technology</p>
                    <h2>技术栈</h2>
                </div>
                <div class="technology-grid">
                    <article v-for="item in technologies" :key="item.name" class="technology-item">
                        <component :is="item.icon" class="technology-icon" />
                        <div>
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="content-section source-section">
            <div class="section-inner source-layout">
                <div class="section-heading">
                    <p class="section-label">Source & License</p>
                    <h2>来源与声明</h2>
                </div>
                <div class="source-details">
                    <div class="detail-row">
                        <span>源代码</span>
                        <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer">
                            github.com/FairlyHe/fairly-wallpaper
                        </a>
                    </div>
                    <div class="detail-row">
                        <span>图片数据</span>
                        <a :href="wallpaperSourceUrl" target="_blank" rel="noopener noreferrer">360 壁纸</a>
                    </div>
                    <div class="notice">
                        <icon-info-circle />
                        <p>本项目仅用于技术学习与交流。图片版权归原作者及相关权利人所有，请勿将项目中的图片用于商业用途。</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped lang="less">
.about-page {
    height: 100%;
    overflow-y: auto;
    color: var(--color-text-1);
    background: var(--color-bg-1);
}

.intro-section {
    padding: 64px 24px 56px;
    border-bottom: 1px solid var(--color-border-2);
}

.intro-content,
.section-inner {
    width: min(1040px, 100%);
    margin: 0 auto;
}

.intro-content {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
}

.project-mark {
    display: grid;
    width: 88px;
    height: 88px;
    place-items: center;
    border: 1px solid var(--color-border-2);
    border-radius: 8px;
    background: var(--color-fill-2);
    color: rgb(var(--primary-6));
}

.project-mark img {
    width: 68px;
    height: 68px;
    object-fit: contain;
}

.section-label {
    margin: 0 0 8px;
    color: rgb(var(--primary-6));
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
}

h1 {
    margin: 0;
    font-size: 38px;
    line-height: 1.2;
}

.project-summary {
    max-width: 680px;
    margin: 16px 0 24px;
    color: var(--color-text-2);
    font-size: 16px;
    line-height: 1.8;
}

.content-section {
    padding: 48px 24px;
    border-bottom: 1px solid var(--color-border-2);
}

.section-heading h2 {
    margin: 0 0 28px;
    font-size: 24px;
}

.technology-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid var(--color-border-2);
    border-left: 1px solid var(--color-border-2);
}

.technology-item {
    display: flex;
    min-height: 112px;
    gap: 14px;
    align-items: center;
    padding: 20px;
    border-right: 1px solid var(--color-border-2);
    border-bottom: 1px solid var(--color-border-2);
}

.technology-icon {
    flex: 0 0 auto;
    color: rgb(var(--primary-6));
    font-size: 24px;
}

.technology-item h3,
.technology-item p {
    margin: 0;
}

.technology-item h3 {
    font-size: 15px;
}

.technology-item p {
    margin-top: 6px;
    color: var(--color-text-3);
    font-size: 13px;
}

.source-section {
    border-bottom: 0;
}

.source-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 48px;
}

.source-details {
    border-top: 1px solid var(--color-border-2);
}

.detail-row {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
    gap: 20px;
    padding: 18px 0;
    border-bottom: 1px solid var(--color-border-2);
}

.detail-row span {
    color: var(--color-text-3);
}

.detail-row a {
    color: rgb(var(--primary-6));
    overflow-wrap: anywhere;
    text-decoration: none;
}

.notice {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding: 16px;
    border-left: 3px solid rgb(var(--warning-6));
    background: var(--color-fill-2);
    color: var(--color-text-2);
    line-height: 1.7;
}

.notice svg {
    flex: 0 0 auto;
    margin-top: 4px;
    color: rgb(var(--warning-6));
}

.notice p {
    margin: 0;
}

@media (max-width: 800px) {
    .technology-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .source-layout {
        grid-template-columns: 1fr;
        gap: 8px;
    }
}

@media (max-width: 520px) {
    .intro-section,
    .content-section {
        padding: 32px 16px;
    }

    .intro-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .project-mark {
        width: 64px;
        height: 64px;
    }

    .project-mark img {
        width: 50px;
        height: 50px;
    }

    h1 {
        font-size: 30px;
    }

    .technology-grid {
        grid-template-columns: 1fr;
    }

    .detail-row {
        grid-template-columns: 1fr;
        gap: 6px;
    }
}
</style>
