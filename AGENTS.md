# Правила верстки для агентов

## Базовый layout секций

Актуальная основная структура для новых и переверстываемых контентных блоков — layout `Section -> Card -> Content`, повторяющий структуру слоев из Figma. Если в задаче не сказано обратного, все новые блоки и все блоки, которые трогаем в рамках переверстки, приводим к этой структуре:

```html
<section class="section-card-layout section-name">
  <div class="section-card ...">
    <div class="section-card__content ...">
      ...
    </div>
  </div>
</section>
```

Смысл слоев:

- `Section` / `.section-card-layout` — внешний слой секции и ее отступ от страницы.
- `Card` / `.section-card` — большая карточка секции: фон, радиус, декоративное изображение или пустой фон.
- `Content` / `.section-card__content` — внутренний контентный контейнер. По умолчанию `max-width: 1280px`.

## Нюансы применения

- `Section -> Card -> Content` — целевая структура проекта для дальнейшей верстки. Старые блоки и прежние layout-паттерны остаются на поддержке, но не считаются ориентиром для новых секций.
- Для Figma-макетов переносить именно структуру слоев `Section -> Card -> Content`, размеры, радиусы, отступы, фоновые слои и overlay-градиенты из данных Figma. Скриншоты использовать только для финальной проверки.
- Если у секции нет фонового изображения или цветного фона, структуру все равно сохранять: `Section -> Card -> Content`, но `Card` оставлять без фонового модификатора или с прозрачным фоном.
- Если нужен мягкий фон карточки, использовать существующий модификатор `.section-card--soft`.
- Если нужен фон-картинка, использовать `.section-card--image-bg` и отдельный `img.section-card__background` внутри `Card`; для декоративного фонового изображения задавать пустой `alt=""`.
- Не задавать ширину контента локально без причины. Общий лимит для `.section-card__content` — `1280px`; менять его только если в задаче явно указан другой layout.
- Локальные переопределения `.section-card-layout`, `.section-card` и `.section-card__content` допустимы только внутри конкретной секции и только когда этого требует Figma-макет или явно заданный layout.
- Стили общей структуры держать в `src/scss/layout/_section-layout.scss`, а стили конкретной секции — в отдельном файле секции в `src/scss/sections/`.
- Повторяемые визуальные значения выносить в токены в `src/scss/abstracts/_tokens.scss`, а не размазывать сырые цвета, тени и радиусы по секциям.
- Мобильную версию делать самостоятельно, если ее нет в Figma: сохранять ту же иерархию, убирать горизонтальный overflow, адаптировать сетки в один столбец и уменьшать радиусы/отступы только на breakpoint-уровне.
- Для адаптива по умолчанию использовать текущие breakpoint'ы проекта: `1180px` для планшетной перестройки и `820px` для мобильной. Узкие фиксы вроде `420px` добавлять только точечно, когда без них ломается конкретный блок.
- Не использовать этот паттерн для hero или технических/layout-специфичных блоков, если дизайн или задача явно требуют другой структуры.

## Текущие shared-классы

- `.section-card-layout`
- `.section-card`
- `.section-card--soft`
- `.section-card--image-bg`
- `.section-card__background`
- `.section-card__content`

## Текущие skills

Перед задачами по Figma, верстке и визуальной проверке использовать актуальные локальные skills:

- [figma-project-workflow](/Users/dentotsky/.codex/skills/figma-project-workflow/SKILL.md) — проектный workflow для переноса Figma-макетов в этот фронтенд.
- [reuse-existing-ui](/Users/dentotsky/.codex/skills/reuse-existing-ui/SKILL.md) — правила переиспользования существующих UI-примитивов, токенов и SCSS-паттернов.
- [browser:control-in-app-browser](/Users/dentotsky/.codex/plugins/cache/openai-bundled/browser/26.609.30741/skills/control-in-app-browser/SKILL.md) — проверка локальной страницы в браузере после визуальных изменений.
- [figma:figma-use](/Users/dentotsky/.codex/plugins/cache/openai-curated-remote/figma/2.0.9/skills/figma-use/SKILL.md) — обязательный skill перед write-действиями в Figma через `use_figma`.
- [figma:figma-generate-design](/Users/dentotsky/.codex/plugins/cache/openai-curated-remote/figma/2.0.9/skills/figma-generate-design/SKILL.md) — когда нужно собрать или обновить экран/секцию в Figma.
- [imagegen](/Users/dentotsky/.codex/skills/.system/imagegen/SKILL.md) — генерация bitmap-изображений, если для страницы нужны новые растровые визуалы.

Plugin skills из `.codex/plugins/cache` не переносить в проект как живые копии: cache управляется плагинами и может обновляться. Проектные уточнения к ним держать в этом `AGENTS.md` или в отдельном проектном skill, если понадобится самостоятельный workflow.
