const INSERT = 'INSERT';
const DO_UPDATE = 'DO UPDATE';

interface ReturningMapValue {
  column: string;
  alias?: string;
}

interface UpsertMapValue {
  column: string;
  value: string | number | object | undefined;
}

export class QueryBuilder {
  private type?: string;
  private table?: string;
  private columnList?: Array<string>;
  private valueList?: Array<string | number | object | boolean | undefined>;
  private conflictTarget?: string | boolean;
  private constraint?: string;
  private conflictAction?: string;
  private upsertMap?: Map<string, UpsertMapValue>;
  private returningMap?: Map<string, ReturningMapValue>;

  private buildInsert(): string {
    if (!this.table) this.table = '';
    const insertClause = `INSERT INTO ${this.table}`;
    let columnList = '';
    if (Array.isArray(this.columnList) && this.columnList.length > 0) {
      columnList = this.columnList.join(',\n  ');
      columnList = ` (\n  ${columnList}\n)`;
    }

    if (!this.valueList) this.valueList = [];
    let valuesClause = '';
    for (let i = 0; i < this.valueList.length; i++) {
      const num = i + 1;
      if (i === 0) {
        valuesClause = `\nVALUES ($${num}`;
      } else if (i % (this.columnList as Array<string>).length === 0) {
        valuesClause = `${valuesClause}),\n  ($${num}`;
      } else {
        valuesClause = `${valuesClause}, $${num}`;
      }
    }
    if (valuesClause) {
      valuesClause = `${valuesClause})`;
    }

    let onConflictClause = '';
    if (this.conflictTarget) {
      onConflictClause = '\nON CONFLICT';
      if (this.constraint) {
        onConflictClause = `${onConflictClause} ON CONSTRAINT ${this.constraint}`;
      } else {
        onConflictClause = `${onConflictClause} (${this.conflictTarget})`;
      }
      if (this.conflictAction === DO_UPDATE) {
        onConflictClause = `${onConflictClause}\n${DO_UPDATE}`;
      }
      let setClause = '';
      if (this.upsertMap && this.upsertMap.size > 0) {
        for (const {column, value} of this.upsertMap.values()) {
          const expression = `${column} = ${value}`;
          if (setClause) {
            setClause = `${setClause},\n  ${expression}`;
          } else {
            setClause = ` SET ${expression}`;
          }
        }
      }
      onConflictClause = `${onConflictClause}${setClause}`;
    }

    let returningClause = '';
    if (this.returningMap && this.returningMap.size > 0) {
      const returningList = this.returningMap.values();
      for (const {column, alias} of returningList) {
        const expression = alias ? `${column} AS "${alias}"` : `${column}`;
        if (returningClause) {
          returningClause = `${returningClause},\n  ${expression}`;
        } else {
          returningClause = `\nRETURNING ${expression}`;
        }
      }
    }

    return `${insertClause}${columnList}${valuesClause}${onConflictClause}${returningClause}`;
  }

  insert() {
    this.type = INSERT;
    return this;
  }
  into(table: string) {
    this.table = table;
    return this;
  }
  columns(...columns: Array<string>) {
    this.columnList = columns;
    return this;
  }
  values(...values: Array<string | number | object | boolean | undefined>) {
    if (!this.valueList) this.valueList = [];
    this.valueList.push(...values);
    return this;
  }
  onConflict(conflictTarget?: string) {
    this.conflictTarget = conflictTarget;
    return this;
  }
  onConstraint(constraint: string) {
    this.conflictTarget = true;
    this.constraint = constraint;
    return this;
  }
  doUpdate() {
    this.conflictAction = DO_UPDATE;
    return this;
  }
  set(column: string, value: string) {
    if (!this.upsertMap) this.upsertMap = new Map();
    this.upsertMap.set(column, {column, value});
    return this;
  }
  returning(column: string, alias?: string) {
    if (!this.returningMap) this.returningMap = new Map();
    this.returningMap.set(column, {column, alias});
    return this;
  }

  build() {
    let text = '';
    if (this.type === INSERT) {
      text = this.buildInsert();
    }
    return {text, values: this.valueList};
  }
}
