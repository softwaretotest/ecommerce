export const getFontsizer = (value) => {
    const length = String(value).length;

    return length >= 13
        ? "count-xx-small"
        : length >= 11
          ? "count-x-small"
          : length >= 9
            ? "count-smaller"
            : length >= 7
              ? "count-small"
              : length >= 5
                ? "count-medium"
                : length >= 3
                  ? "count-x-large"
                  : "count-xx-large";
};

export const isOverflow = (value) => String(value).length > 9;
