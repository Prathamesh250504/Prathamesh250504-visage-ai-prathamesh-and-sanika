import cv2
import numpy as np
from PIL import Image
import io
import base64

class FaceProcessor:
    def __init__(self):
        try:
            # Initialize OpenCV face detection as fallback
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            print("✅ OpenCV Face Detection initialized")
            self.detection_method = 'opencv'
        except Exception as e:
            print(f"❌ Error initializing face detection: {e}")
            self.face_cascade = None
            self.detection_method = 'none'
    
    def detect_landmarks(self, image):
        """
        Detect face landmarks in an image using OpenCV
        Returns face detection results and processed image
        """
        try:
            # Convert PIL to OpenCV format
            if isinstance(image, Image.Image):
                opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            else:
                opencv_image = image
            
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(30, 30)
            )
            
            landmarks_data = []
            annotated_image = opencv_image.copy()
            
            # Process detected faces
            for (x, y, w, h) in faces:
                # Create simplified landmark points (face boundary)
                landmarks = []
                
                # Create 68 landmark-like points around the face rectangle
                # Top edge
                for i in range(17):
                    landmarks.append({
                        'x': (x + (i * w / 16)) / opencv_image.shape[1],
                        'y': y / opencv_image.shape[0],
                        'z': 0.0
                    })
                
                # Right edge
                for i in range(5):
                    landmarks.append({
                        'x': (x + w) / opencv_image.shape[1],
                        'y': (y + (i * h / 4)) / opencv_image.shape[0],
                        'z': 0.0
                    })
                
                # Bottom edge
                for i in range(17):
                    landmarks.append({
                        'x': (x + w - (i * w / 16)) / opencv_image.shape[1],
                        'y': (y + h) / opencv_image.shape[0],
                        'z': 0.0
                    })
                
                # Left edge
                for i in range(5):
                    landmarks.append({
                        'x': x / opencv_image.shape[1],
                        'y': (y + h - (i * h / 4)) / opencv_image.shape[0],
                        'z': 0.0
                    })
                
                # Add center points
                landmarks.extend([
                    # Eyes
                    {'x': (x + w * 0.3) / opencv_image.shape[1], 'y': (y + h * 0.4) / opencv_image.shape[0], 'z': 0.0},
                    {'x': (x + w * 0.7) / opencv_image.shape[1], 'y': (y + h * 0.4) / opencv_image.shape[0], 'z': 0.0},
                    # Nose
                    {'x': (x + w * 0.5) / opencv_image.shape[1], 'y': (y + h * 0.6) / opencv_image.shape[0], 'z': 0.0},
                    # Mouth
                    {'x': (x + w * 0.5) / opencv_image.shape[1], 'y': (y + h * 0.8) / opencv_image.shape[0], 'z': 0.0},
                ])
                
                landmarks_data.append(landmarks)
                
                # Draw face rectangle and key points
                cv2.rectangle(annotated_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # Draw key facial points
                cv2.circle(annotated_image, (int(x + w * 0.3), int(y + h * 0.4)), 3, (255, 0, 0), -1)  # Left eye
                cv2.circle(annotated_image, (int(x + w * 0.7), int(y + h * 0.4)), 3, (255, 0, 0), -1)  # Right eye
                cv2.circle(annotated_image, (int(x + w * 0.5), int(y + h * 0.6)), 3, (0, 0, 255), -1)  # Nose
                cv2.circle(annotated_image, (int(x + w * 0.5), int(y + h * 0.8)), 3, (0, 255, 255), -1)  # Mouth
            
            return {
                'landmarks_detected': len(landmarks_data) > 0,
                'num_faces': len(landmarks_data),
                'landmarks': landmarks_data,
                'annotated_image': annotated_image,
                'detection_method': self.detection_method
            }
            
        except Exception as e:
            print(f"Error in landmark detection: {e}")
            return {
                'landmarks_detected': False,
                'num_faces': 0,
                'landmarks': [],
                'annotated_image': opencv_image if 'opencv_image' in locals() else None,
                'error': str(e),
                'detection_method': self.detection_method
            }
    
    def crop_face_region(self, image, landmarks):
        """
        Crop face region based on landmarks for better CNN analysis
        """
        try:
            if not landmarks:
                return image
            
            # Convert PIL to numpy if needed
            if isinstance(image, Image.Image):
                img_array = np.array(image)
            else:
                img_array = image
            
            height, width = img_array.shape[:2]
            
            # Get face boundary landmarks (approximate face contour)
            face_landmarks = landmarks[0]  # Use first face
            
            # Extract x, y coordinates
            x_coords = [lm['x'] * width for lm in face_landmarks]
            y_coords = [lm['y'] * height for lm in face_landmarks]
            
            # Calculate bounding box with padding
            min_x = max(0, int(min(x_coords)) - 20)
            max_x = min(width, int(max(x_coords)) + 20)
            min_y = max(0, int(min(y_coords)) - 20)
            max_y = min(height, int(max(y_coords)) + 20)
            
            # Crop the face region
            cropped = img_array[min_y:max_y, min_x:max_x]
            
            # Convert back to PIL Image
            if isinstance(image, Image.Image):
                return Image.fromarray(cropped)
            else:
                return cropped
                
        except Exception as e:
            print(f"Error in face cropping: {e}")
            return image
    
    def analyze_face_quality(self, landmarks):
        """
        Analyze face quality based on landmarks
        """
        try:
            if not landmarks:
                return {
                    'quality_score': 0.0,
                    'face_detected': False,
                    'recommendations': ['No face detected']
                }
            
            face_landmarks = landmarks[0]
            recommendations = []
            quality_factors = []
            
            # Check face size (based on landmark spread)
            x_coords = [lm['x'] for lm in face_landmarks]
            y_coords = [lm['y'] for lm in face_landmarks]
            
            face_width = max(x_coords) - min(x_coords)
            face_height = max(y_coords) - min(y_coords)
            
            # Face size quality (should be reasonable size)
            size_quality = min(1.0, (face_width + face_height) / 1.0)  # Normalized
            quality_factors.append(size_quality)
            
            if face_width < 0.3 or face_height < 0.3:
                recommendations.append("Face appears too small - move closer to camera")
            
            # Check face centering
            center_x = (max(x_coords) + min(x_coords)) / 2
            center_y = (max(y_coords) + min(y_coords)) / 2
            
            centering_quality = 1.0 - (abs(center_x - 0.5) + abs(center_y - 0.5))
            quality_factors.append(max(0.0, centering_quality))
            
            if abs(center_x - 0.5) > 0.2:
                recommendations.append("Center your face horizontally in the frame")
            if abs(center_y - 0.5) > 0.2:
                recommendations.append("Center your face vertically in the frame")
            
            # Overall quality score
            quality_score = sum(quality_factors) / len(quality_factors) if quality_factors else 0.0
            
            if quality_score > 0.8:
                recommendations.append("Excellent face detection quality!")
            elif quality_score > 0.6:
                recommendations.append("Good face detection quality")
            else:
                recommendations.append("Consider improving lighting and positioning")
            
            return {
                'quality_score': quality_score,
                'face_detected': True,
                'face_size': {'width': face_width, 'height': face_height},
                'face_center': {'x': center_x, 'y': center_y},
                'recommendations': recommendations
            }
            
        except Exception as e:
            print(f"Error in face quality analysis: {e}")
            return {
                'quality_score': 0.0,
                'face_detected': False,
                'recommendations': [f'Error analyzing face quality: {str(e)}']
            }
    
    def image_to_base64(self, opencv_image):
        """
        Convert OpenCV image to base64 string for frontend display
        """
        try:
            # Convert BGR to RGB
            rgb_image = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2RGB)
            
            # Convert to PIL Image
            pil_image = Image.fromarray(rgb_image)
            
            # Convert to base64
            buffer = io.BytesIO()
            pil_image.save(buffer, format='JPEG', quality=85)
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/jpeg;base64,{img_str}"
            
        except Exception as e:
            print(f"Error converting image to base64: {e}")
            return None
    
    def __del__(self):
        """Clean up resources"""
        pass  # No cleanup needed for OpenCV