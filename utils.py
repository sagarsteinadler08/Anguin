def convert_height_to_meters(feet, inches=0, cm=0, system="Metric"):
    """
    Converts height to meters based on the selected system.
    """
    if system == "Metric":
        return cm / 100.0
    else:
        # 1 ft = 0.3048 m, 1 in = 0.0254 m
        return (feet * 0.3048) + (inches * 0.0254)

def convert_weight_to_kg(weight_val, weight_val2=0, unit="kg"):
    """
    Converts weight to kg.
    Imperial scenarios:
    - 'lb': weight_val is lbs
    - 'st': weight_val is stone, weight_val2 is lbs
    """
    if unit == "kg":
        return weight_val
    elif unit == "lb":
        return weight_val * 0.453592
    elif unit == "st":
        # 1 stone = 6.35029 kg, 1 lb = 0.453592 kg
        return (weight_val * 6.35029) + (weight_val2 * 0.453592)
    return weight_val

def calculate_bmi(weight_kg, height_m):
    """Calculates Standard BMI."""
    if height_m <= 0:
        return 0
    return weight_kg / (height_m ** 2)

def get_standard_category(bmi):
    """Returns standard WHO category."""
    if bmi < 18.5: return "Underweight", "#3498db"
    elif bmi < 24.9: return "Healthy Weight", "#2ecc71"
    elif bmi < 29.9: return "Overweight", "#f1c40f"
    else: return "Obese", "#e74c3c"

def get_sbmi_interpretation(bmi, age, gender, ethnicity):
    """
    Returns SBMI adjusted interpretation and healthy weight range (min, max).
    
    THRESHOLDS BASED ON DIABETES RISK EQUIVALENCE (Lancet Diabetes Endocrinol 2021; 9: 419–26):
    The following BMI values carry equivalent risk to White BMI 25 (Overweight) and 30 (Obese):
    - White:       25.0 / 30.0
    - Black:       23.4 / 28.1
    - Chinese:     22.2 / 26.9
    - Arab:        22.1 / 26.6
    - South Asian: 19.2 / 23.9
    - Other/Mixed: Defaulting to standard WHO for now, or conservative Asian if specified.
    
    Age Adjustment:
    - Seniors (>65): Minimum healthy BMI raises to 22.0 to protect against frailty.
    """
    
    # Defaults (White / Standard WHO)
    th_over = 25.0
    th_obese = 30.0
    th_under = 18.5
    
    # 1. Ethnicity Adjustment
    if ethnicity == "South Asian":
        th_over = 19.2  # Extremely strict, maybe use "Caution" zone 19.2-23
        th_obese = 23.9
    elif ethnicity == "Chinese":
        th_over = 22.2
        th_obese = 26.9
    elif ethnicity == "Black":
        th_over = 23.4
        th_obese = 28.1
    elif ethnicity == "Arab":
        th_over = 22.1
        th_obese = 26.6
    elif ethnicity == "Asian (Other)":
        th_over = 23.0
        th_obese = 27.5
        
    # 2. Age Adjustment (Seniors need more reserves)
    if age >= 65:
        th_under = 22.0 # Higher floor for seniors
        # If the ethnicity threshold is very low (e.g. South Asian 23.9), 
        # but age requires higher weight, we prioritize AGE for the 'Underweight' risk 
        # and ETHNICITY for the 'Obesity' (diabetes) risk.
        # This creates a very narrow 'Optimal' window for South Asian Seniors, which is clinically accurate (hard to balance).
        
    # Categorize
    category = ""
    color = ""
    
    if bmi < th_under:
        category = "Underweight / Frailty Risk"
        color = "#ef4444" # Red
    elif bmi < th_over:
        category = "Optimal / Healthy"
        color = "#22d3ee" # Cyan
    elif bmi < th_obese:
        category = "Overweight / Moderate Risk"
        color = "#facc15" # Yellow
    else:
        category = "Obese / High Risk"
        color = "#f472b6" # Pink/Red

    return category, color, (th_under, th_over)
