export interface Borrower {
    borrower_id: number;
    user_id: number; // Foreign key from Users
    copy_id: number; // Foreign key from BookCopies
    librarian_id: number; // Foreign key from Users
    borrow_date: Date;
    return_date?: Date;
    status: "Borrowed" | "Returned" | "Overdue";
    created_at?: Date;
    updated_at?: Date;
  }
  