module.exports = englishHitLevel => {
    return englishHitLevel.replace(/h/gi, '상')
        .replace(/Sm/gi, '특중')
        .replace(/m/gi, '중')
        .replace(/l/gi, '하')
        .replace(/TJ/gi, '점프판정')
        .replace(/TC/gi, '앉기판정')
}