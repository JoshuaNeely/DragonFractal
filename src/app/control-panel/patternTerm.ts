export class PatternTerm {
    repetitions: number;
    angle: number;

    constructor(termString: string) {
        const multipliedTerms = termString.split('a').map((x) => Number(x));
        const isMultiplied = (multipliedTerms.length === 2);

        const multiple = isMultiplied ? multipliedTerms[0] : 1;
        const angle = isMultiplied ? multipliedTerms[1] : multipliedTerms[0];

        this.repetitions = multiple;
        this.angle = angle;
    }
}
