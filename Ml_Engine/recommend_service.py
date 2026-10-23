from datetime import datetime, date
import re

def build_or_regex_for_values(values):
    """Return regex objects for case-insensitive filtering."""
    if not values:
        return []
    return [re.compile(f"^{re.escape(v)}$", re.IGNORECASE) for v in values]


def parse_stipend_to_number(stipend_str):
    """Convert stipend like '₹10K-20K' or 'Unpaid' into numeric (lower bound)."""
    if not stipend_str or stipend_str.lower() == "unpaid":
        return 0
    try:
        stipend_str = stipend_str.replace("₹", "").replace("K", "000").replace("+", "")
        if "-" in stipend_str:
            parts = stipend_str.split("-")
            return int(parts[0].strip())
        return int(stipend_str.strip())
    except Exception:
        return None


def parse_filter_stipend_range(stipend_filter):
    """Return stipend range tuple (min, max)."""
    if stipend_filter.lower() == "unpaid":
        return (0, 0)
    try:
        s = stipend_filter.replace("₹", "").replace("K", "000").replace("+", "")
        if "-" in s:
            mn, mx = s.split("-")
            return (int(mn.strip()), int(mx.strip()))
        return (int(s.strip()), 10**9)  
    except Exception:
        return None


def last_date_is_open(last_date_str):
    """Return True if internship is still open (lastDate >= today)."""
    from datetime import datetime
    try:
        last_date = datetime.strptime(last_date_str, "%d-%m-%Y")
        return last_date >= datetime.today()
    except Exception:
        return False