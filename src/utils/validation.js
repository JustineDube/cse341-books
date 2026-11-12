const hasExactKeys = (value, keys) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }

    const actualKeys = Object.keys(value);
    return actualKeys.length === keys.length && keys.every((key) => {
        return actualKeys.includes(key);
    });
};

const isValidCustomId = (value) => {
    return typeof value === 'string'
        && value.length >= 1
        && value.length <= 50
        && /^[A-Za-z0-9_-]+$/.test(value);
};

const isValidPersonName = (value, maxLength) => {
    return typeof value === 'string'
        && value.trim().length > 0
        && value.trim().length <= maxLength;
};

const isValidBirthYear = (value) => {
    return Number.isInteger(value)
        && value >= 0
        && value <= new Date().getFullYear();
};

const isValidPublicationDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
};

export {
    hasExactKeys,
    isValidBirthYear,
    isValidCustomId,
    isValidPersonName,
    isValidPublicationDate
};
