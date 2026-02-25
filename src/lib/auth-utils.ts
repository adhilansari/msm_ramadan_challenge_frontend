export function formatAndValidatePhone(countryCode: string, phoneLocalInput: string) {
    const phoneLocal = phoneLocalInput.replace(/\D/g, ''); // strip non-digits

    // Validate phone number length based on country code
    const phoneLengths: Record<string, number | number[]> = {
        '+91': 10, // India
        '+971': 9,  // UAE
        '+966': 9,  // Saudi
        '+1': 10,   // US/Canada
        '+44': 10,  // UK
        '+60': [9, 10], // Malaysia
        '+65': 8,   // Singapore
    };

    const expectedLength = phoneLengths[countryCode];

    if (expectedLength) {
        const isValid = Array.isArray(expectedLength)
            ? expectedLength.includes(phoneLocal.length)
            : phoneLocal.length === expectedLength;

        if (!isValid) {
            const lengthMsg = Array.isArray(expectedLength)
                ? `${expectedLength.join(' or ')}`
                : expectedLength;
            return { error: `Phone number for ${countryCode} must be exactly ${lengthMsg} digits.`, formattedPhone: null };
        }
    }

    return { error: null, formattedPhone: countryCode + phoneLocal };
}
