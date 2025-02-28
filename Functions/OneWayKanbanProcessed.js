export class OneWayKanbanProcessed {
  constructor(oneWayKanbanQR) {
    this.oneWayKanbanQR = oneWayKanbanQR;
  }

  getDate() {
    let fixCode = this.oneWayKanbanQR.substring(0, 7);
    return fixCode;
  }

  getWhCode() {
    let fixCode = this.oneWayKanbanQR.substring(22, 23);
    return fixCode;
  }

  getUniqueCode() {
    let uniqueCode = this.oneWayKanbanQR.substring(23);
    return uniqueCode;
  }

  getPartNumber() {
    const partnoSuffix = this.oneWayKanbanQR.substring(0, 15).trim();
    const partno = partnoSuffix.endsWith("A")
      ? partnoSuffix.slice(0, -1)
      : partnoSuffix;
    return partno;
  }

  getQtyPerKanban() {
    let qtyPerKanban = this.oneWayKanbanQR.substring(16, 22);

    let newQty = "";
    for (let index = 0; index < qtyPerKanban.length; index++) {
      if (qtyPerKanban.charAt(index) !== 0) {
        newQty += qtyPerKanban.charAt(index);
      }
    }
    return parseInt(newQty);
  }
}
