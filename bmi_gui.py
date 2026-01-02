import tkinter as tk
from tkinter import ttk, messagebox
import csv
import os
from datetime import datetime

# ====================================================
# CONFIGURATION
# ====================================================
HISTORY_FILE = "bmi_history.csv"
ASSETS_DIR = "assets"

# Colors (High Contrast & Professional)
COLOR_BG = "#F5F7FA"         # Light Blue-Grey Background
COLOR_CARD = "#FFFFFF"       # White Card
COLOR_PRIMARY = "#2C3E50"    # Dark Blue-Grey (Text/Buttons)
COLOR_ACCENT = "#3498DB"     # Bright Blue (Highlight)
COLOR_SUCCESS = "#2ECC71"    # Green
COLOR_WARNING = "#F1C40F"    # Yellow
COLOR_DANGER = "#E74C3C"     # Red
COLOR_TEXT = "#333333"       # Dark Text

class GenderCard(tk.Canvas):
    """Custom Selectable Card for Gender"""
    def __init__(self, parent, gender, icon_path, command):
        super().__init__(parent, width=160, height=200, bg=COLOR_CARD, highlightthickness=0)
        self.gender = gender
        self.command = command
        self.selected = False
        
        # Load Image
        try:
            self.img = tk.PhotoImage(file=icon_path)
        except Exception as e:
            print(f"Error loading {icon_path}: {e}")
            self.img = None
            
        self.bind("<Button-1>", self.on_click)
        self.draw()

    def draw(self):
        self.delete("all")
        
        # Background & Border
        border_color = COLOR_ACCENT if self.selected else "#DDDDDD"
        bg_color = "#EBF5FB" if self.selected else COLOR_CARD
        border_width = 4 if self.selected else 2
        
        # Draw Rounded Rect (Approximated with polygon or just rect)
        self.create_rectangle(5, 5, 155, 195, fill=bg_color, outline=border_color, width=border_width)
        
        # Draw Image
        if self.img:
            self.create_image(80, 90, image=self.img)
            
        # Draw Label
        font_style = ("Helvetica", 14, "bold") if self.selected else ("Helvetica", 14)
        text_color = COLOR_ACCENT if self.selected else "#777777"
        self.create_text(80, 170, text=self.gender, font=font_style, fill=text_color)
        
        # Checkmark (Visual Feedback)
        if self.selected:
             self.create_oval(130, 10, 150, 30, fill=COLOR_ACCENT, outline=COLOR_ACCENT)
             self.create_text(140, 20, text="✓", fill="white", font=("Helvetica", 12, "bold"))

    def on_click(self, event):
        self.command(self.gender)

    def set_state(self, is_selected):
        self.selected = is_selected
        self.draw()


class BMICalculatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Advanced BMI Calculator")
        self.root.geometry("600x750")
        self.root.configure(bg=COLOR_BG)
        self.root.resizable(False, False)

        # State vars
        self.height_var = tk.StringVar()
        self.weight_var = tk.StringVar()
        self.age_var = tk.StringVar(value="25")
        self.selected_gender = None
        self.gender_cards = {}

        self.setup_ui()

    def setup_ui(self):
        # --- HEADER ---
        header_frame = tk.Frame(self.root, bg=COLOR_BG)
        header_frame.pack(pady=20)
        tk.Label(header_frame, text="BMI Calculator", font=("Helvetica", 24, "bold"), bg=COLOR_BG, fg=COLOR_PRIMARY).pack()
        tk.Label(header_frame, text="Check your Body Mass Index", font=("Helvetica", 12), bg=COLOR_BG, fg="#7F8C8D").pack()

        # --- GENDER SECTION ---
        gender_frame = tk.Frame(self.root, bg=COLOR_BG)
        gender_frame.pack(pady=10)
        tk.Label(gender_frame, text="Select Gender", font=("Helvetica", 12, "bold"), bg=COLOR_BG, fg="#555").pack(anchor="w", padx=45)
        
        cards_container = tk.Frame(gender_frame, bg=COLOR_BG)
        cards_container.pack(pady=5)
        
        self.gender_cards["Male"] = GenderCard(cards_container, "Male", f"{ASSETS_DIR}/male_icon.png", self.select_gender)
        self.gender_cards["Male"].pack(side="left", padx=10)
        
        self.gender_cards["Female"] = GenderCard(cards_container, "Female", f"{ASSETS_DIR}/female_icon.png", self.select_gender)
        self.gender_cards["Female"].pack(side="left", padx=10)

        # --- INPUTS ---
        input_container = tk.Frame(self.root, bg="white", padx=30, pady=20, relief="flat")
        input_container.pack(fill="x", padx=40, pady=10)

        # Row 1: Age & Weight
        row1 = tk.Frame(input_container, bg="white")
        row1.pack(fill="x", pady=10)
        
        # Age
        tk.Label(row1, text="AGE", font=("Helvetica", 10, "bold"), bg="white", fg="#999").grid(row=0, column=0, sticky="w")
        tk.Entry(row1, textvariable=self.age_var, font=("Helvetica", 16), width=5, justify="center", bg="#F4F4F4", relief="flat").grid(row=1, column=0, pady=5, ipady=5)
        
        # Weight
        tk.Label(row1, text="WEIGHT (kg)", font=("Helvetica", 10, "bold"), bg="white", fg="#999").grid(row=0, column=1, sticky="w", padx=40)
        tk.Entry(row1, textvariable=self.weight_var, font=("Helvetica", 16), width=8, justify="center", bg="#F4F4F4", relief="flat").grid(row=1, column=1, padx=40, pady=5, ipady=5)

        # Row 2: Height
        row2 = tk.Frame(input_container, bg="white")
        row2.pack(fill="x", pady=15)
        tk.Label(row2, text="HEIGHT (cm)", font=("Helvetica", 10, "bold"), bg="white", fg="#999").pack(anchor="w")
        tk.Entry(row2, textvariable=self.height_var, font=("Helvetica", 16), width=20, justify="center", bg="#F4F4F4", relief="flat").pack(fill="x", pady=5, ipady=5)

        # --- BUTTONS ---
        btn_frame = tk.Frame(self.root, bg=COLOR_BG)
        btn_frame.pack(pady=20, fill="x", padx=40)
        
        # Calculate (Primary)
        self.calc_btn = tk.Button(btn_frame, text="CALCULATE BMI", font=("Helvetica", 12, "bold"), 
                                  bg=COLOR_PRIMARY, fg="white", activebackground="#34495E", activeforeground="white",
                                  relief="flat", cursor="hand2", command=self.calculate)
        self.calc_btn.pack(fill="x", ipady=10)
        
        # Clear (Secondary) - Just a label link style or simple button
        tk.Button(btn_frame, text="Reset", font=("Helvetica", 11), bg=COLOR_BG, fg="#7F8C8D", 
                  relief="flat", command=self.reset).pack(pady=10)

        # --- RESULT POPUP (Or Section) ---
        # User requested dedicated section. We'll reuse a frame at bottom or separate window if full.
        # Let's use a bottom frame that appears.
        self.result_frame = tk.Frame(self.root, bg="white", padx=20, pady=20)
        # self.result_frame.pack(fill="x", padx=40, pady=10) # Initially hidden

    def select_gender(self, gender):
        self.selected_gender = gender
        for g, card in self.gender_cards.items():
            card.set_state(g == gender)

    def calculate(self):
        # 1. Validation
        if not self.selected_gender:
            messagebox.showwarning("Missing Input", "Please select a gender.")
            return

        try:
            age = int(self.age_var.get())
            weight = float(self.weight_var.get())
            height_cm = float(self.height_var.get())
            
            if age <= 0 or weight <= 0 or height_cm <= 0:
                raise ValueError("Negative or zero.")
                
        except ValueError:
            messagebox.showerror("Invalid Input", "Please enter valid positive numbers for Age, Weight, and Height.")
            return

        # 2. Calculation
        height_m = height_cm / 100.0
        bmi = weight / (height_m ** 2)
        
        # 3. Category
        category, color, advice = self.get_category(bmi)
        
        # 4. Display
        self.show_results(bmi, category, color, advice)
        self.save_history(bmi, category)

    def get_category(self, bmi):
        if bmi < 18.5:
            return "Underweight", COLOR_WARNING, "You are underweight. Consider a balanced nutrient-rich diet."
        elif 18.5 <= bmi < 24.9:
            return "Normal Weight", COLOR_SUCCESS, "You have a healthy weight. Keep up the good work!"
        elif 25 <= bmi < 29.9:
            return "Overweight", COLOR_WARNING, "You are slightly overweight. Regular exercise can help."
        else:
            return "Obese", COLOR_DANGER, "It is recommended to consult a doctor for a health plan."

    def show_results(self, bmi, category, color, advice):
        # Clear previous if any
        for widget in self.result_frame.winfo_children():
            widget.destroy()
            
        self.result_frame.pack(fill="x", padx=40, pady=0, side="bottom", before=None)
        
        tk.Label(self.result_frame, text="YOUR RESULT", font=("Helvetica", 10, "bold"), bg="white", fg="#999").pack()
        
        tk.Label(self.result_frame, text=f"{bmi:.2f}", font=("Helvetica", 48, "bold"), bg="white", fg=COLOR_PRIMARY).pack()
        
        lbl_cat = tk.Label(self.result_frame, text=category, font=("Helvetica", 14, "bold"), bg=color, fg="white", padx=15, pady=5)
        lbl_cat.pack(pady=5)
        
        tk.Label(self.result_frame, text=advice, font=("Helvetica", 11), bg="white", fg="#555", wraplength=400).pack(pady=10)

    def save_history(self, bmi, category):
        # Simple Append
        file_exists = os.path.isfile(HISTORY_FILE)
        with open(HISTORY_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Date", "Height (m)", "Weight (kg)", "BMI", "Category", "Age", "Gender"])
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                round(float(self.height_var.get())/100, 2),
                self.weight_var.get(),
                round(bmi, 2),
                category,
                self.age_var.get(),
                self.selected_gender
            ])

    def reset(self):
        self.age_var.set("25")
        self.weight_var.set("")
        self.height_var.set("")
        self.select_gender(None)
        # Deselect cards visual
        for card in self.gender_cards.values():
            card.set_state(False)
        self.selected_gender = None
        self.result_frame.pack_forget()

if __name__ == "__main__":
    root = tk.Tk()
    app = BMICalculatorApp(root)
    root.mainloop()
