### Procedure

#### Step 1: Import Required Libraries
Import necessary Python libraries including pandas for data handling, NumPy for numerical computations, and Matplotlib for visualisation of the dataset and decision boundaries.

#### Step 2: Create XOR Dataset
Generate the XOR truth table with four data points:

| x₁ | x₂ | Class (y) |
|:---:|:---:|:---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Store this data in a pandas DataFrame for easy manipulation and visualisation.

#### Step 3: Visualise the XOR Dataset
Create a scatter plot showing the four XOR data points with:
- **Blue dots** representing Class 0: points (0,0) and (1,1)
- **Red dots** representing Class 1: points (0,1) and (1,0)

This visualisation clearly shows the diagonal pattern that makes XOR non-linearly separable.

#### Step 4: Initialise Perceptron Parameters
Set random seed for reproducibility and initialise:
- **w₁, w₂**: Random weights uniformly distributed between -1 and 1
- **b**: Random bias uniformly distributed between -1 and 1
- **learning_rate**: Set to 0.05 (or 0.1 in alternate version)

Print initial parameters to track how they change during training.

#### Step 5: Define Decision Boundary Plotting Function
Create a function `plot_decision_boundary(w1, w2, b)` that:
1. Calculates the decision boundary line using equation: `w₁·x₁ + w₂·x₂ + b = 0`
2. Rearranges to: `x₂ = -(w₁·x₁ + b) / w₂`
3. Plots this line in green on the XOR scatter plot
4. Handles the case when `w₂ = 0` (vertical line)

#### Step 6: Visualise Initial Random Decision Boundary
Plot the XOR dataset along with the initial random decision boundary to show the starting position before any training occurs. This demonstrates how randomly initialised weights create an arbitrary separation.

#### Step 7: Define Perceptron Training Function
Implement `perceptron_train()` function that:
- For each epoch:
  - Initialise correct prediction counter
  - For each data point:
    - **Calculate linear output:** `linear_output = w₁·x₁ + w₂·x₂ + b`
    - **Apply step activation:** `prediction = 1` if `linear_output ≥ 0` else `0`
    - Count if prediction matches actual label
    - **Calculate error:** `error = actual_label - prediction`
    - **Update weights:** `w₁ = w₁ + learning_rate × error × x₁`
    - **Update weights:** `w₂ = w₂ + learning_rate × error × x₂`
    - **Update bias:** `b = b + learning_rate × error`
  - **Calculate accuracy:** `accuracy = (correct_predictions / total_points) × 100`
  - Print epoch results showing accuracy and updated parameters
  - Visualise decision boundary after each epoch
- Return final trained weights and bias.

#### Step 8: Run Perceptron Training
Execute the training function for 10 epochs on the XOR dataset.

#### Step 9: Visualise Training Progress
After each epoch, generate and display a plot showing:
- The current decision boundary (green line)
- XOR data points (blue and red dots)
- Epoch number in the title
- Current accuracy percentage

This creates a visual sequence showing how the perceptron tries but fails to find a correct solution.

#### Step 10: Make Final Predictions
Define `predict()` function and use it to make predictions on all four XOR points using the final trained weights. Display results showing:
- Input coordinates
- Predicted class
- Actual class
- Whether prediction is correct or incorrect

Calculate and display final accuracy on the complete XOR dataset.
