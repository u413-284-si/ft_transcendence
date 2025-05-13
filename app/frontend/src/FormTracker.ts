export class FormTracker {
  private form: HTMLFormElement;
  private initialSnapshot: string;

  constructor(form: HTMLFormElement) {
    if (!form) throw new Error("FormTracker requires a form element.");
    this.form = form;
    this.initialSnapshot = this.serialize();
  }

  isDirty(): boolean {
    return this.serialize() !== this.initialSnapshot;
  }

  reset(): void {
    this.initialSnapshot = this.serialize();
  }

  private serialize(): string {
    const formData = new FormData(this.form);

    const sortedEntries = Array.from(formData.entries())
      .map(([key, value]) => [key, value.toString()])
      .sort(([a], [b]) => a.localeCompare(b)) as [string, string][];

    return new URLSearchParams(sortedEntries).toString();
  }
}
