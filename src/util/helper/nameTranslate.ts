interface NameRef {
    engName: Array<string>
    korName: Array<string>
}


export const korToEng = (korName: string): string => {
    const engName: string | undefined = nameList.find((nameRef: NameRef) => nameRef.korName.includes(korName))?.engName[0];

    if (engName === undefined)
        return korName
    else
        return engName
}

export const engToKor = (engName: string): string => {
    const korName: string | undefined = nameList.find((nameRef: NameRef) => nameRef.engName.includes(engName.toLowerCase()))?.korName[0];

    if (korName === undefined)
        return engName
    else
        return korName
}