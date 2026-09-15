"""Verhoeff algorithm implementation for Indian Aadhaar number validation."""

# Multiplication table
VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

# Permutation table
VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]


def validate_verhoeff(num_str: str) -> bool:
    """Validate if the given string satisfies the Verhoeff checksum.

    Standard for 12-digit Indian Aadhaar numbers.
    """
    cleaned = num_str.replace(" ", "").replace("-", "").strip()
    if len(cleaned) != 12 or not cleaned.isdigit():
        return False
    # Aadhaar cannot start with 0 or 1
    if cleaned[0] in ("0", "1"):
        return False

    c = 0
    reversed_digits = [int(x) for x in reversed(cleaned)]
    for i, digit in enumerate(reversed_digits):
        c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]]
    return c == 0


def generate_verhoeff(eleven_digit_str: str) -> str:
    """Generate and append the 12th Verhoeff check digit to an 11-digit prefix."""
    cleaned = eleven_digit_str.replace(" ", "").replace("-", "").strip()
    if len(cleaned) != 11 or not cleaned.isdigit():
        raise ValueError("Input must be exactly 11 digits")

    c = 0
    reversed_digits = [int(x) for x in reversed(cleaned)]
    for i, digit in enumerate(reversed_digits):
        c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]]

    for check_digit in range(10):
        if VERHOEFF_D[c][VERHOEFF_P[0][check_digit]] == 0:
            return cleaned + str(check_digit)
    return cleaned + "0"
