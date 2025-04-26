import cv2
import numpy as np
import os
from matplotlib import pyplot as plt

def process_card_scan(image_path, output_folder):
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image at {image_path}")
        return 0
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply threshold to find cards
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours by area to find only the cards
    min_area = 10000  # Adjust based on your scan resolution
    card_contours = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area]
    
    # Process each card
    for i, contour in enumerate(card_contours):
        # Get rotated rectangle that fits the contour
        rect = cv2.minAreaRect(contour)
        box = cv2.boxPoints(rect)
        box = np.int32(box)
        
        # Get width and height of the detected rectangle
        width = int(rect[1][0])
        height = int(rect[1][1])
        
        # Create source points
        src_pts = box.astype("float32")
        
        # Coordinate of the points in output image
        dst_pts = np.array([[0, height-1],
                            [0, 0],
                            [width-1, 0],
                            [width-1, height-1]], dtype="float32")
        
        # Get perspective transformation matrix
        M = cv2.getPerspectiveTransform(src_pts, dst_pts)
        
        # Apply perspective transformation
        warped = cv2.warpPerspective(img, M, (width, height))
        
        # Save the card as PNG without modifying internal content
        output_path = os.path.join(output_folder, f"1.png")
        cv2.imwrite(output_path, warped)
        
        # Draw rectangle around detected card (for visualization)
        cv2.drawContours(img, [box], 0, (0, 255, 0), 2)
    
    # Show original image with detected cards (optional)
    plt.figure(figsize=(10, 10))
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.title("Detected Cards")
    plt.show()
    
    return len(card_contours)

# Create output directory if it doesn't exist
output_dir = "images/art"
os.makedirs(output_dir, exist_ok=True)

# Process the scan
scan_path = "images/art2.png"  # Replace with your scan image path
num_cards = process_card_scan(scan_path, output_dir)
print(f"Extracted {num_cards} cards to {output_dir}")