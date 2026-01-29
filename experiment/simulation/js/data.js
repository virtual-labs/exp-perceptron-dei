// Pre-computed outputs from all Perceptron iterations
// Key format: {operation}_{lr}

const EXPERIMENT_DATA = {
  "OR_0.1": {
    "operation": "OR",
    "lr": 0.1,
    "initial_params": {
      "w1": -0.400,
      "w2": 0.200,
      "b": -0.100
    },
    "dataset": [
      { "x1": 0, "x2": 0, "label": 0 },
      { "x1": 0, "x2": 1, "label": 1 },
      { "x1": 1, "x2": 0, "label": 1 },
      { "x1": 1, "x2": 1, "label": 1 }
    ],
    "training_epochs": [
      { "epoch": 1, "accuracy": 50.00, "w1": -0.200, "w2": 0.300, "b": 0.100 },
      { "epoch": 2, "accuracy": 50.00, "w1": -0.100, "w2": 0.300, "b": 0.100 },
      { "epoch": 3, "accuracy": 50.00, "w1": -0.000, "w2": 0.300, "b": 0.100 },
      { "epoch": 4, "accuracy": 50.00, "w1": 0.100, "w2": 0.300, "b": 0.100 },
      { "epoch": 5, "accuracy": 75.00, "w1": 0.100, "w2": 0.300, "b": 0.000 },
      { "epoch": 6, "accuracy": 50.00, "w1": 0.200, "w2": 0.300, "b": 0.000 },
      { "epoch": 7, "accuracy": 75.00, "w1": 0.200, "w2": 0.300, "b": -0.100 },
      { "epoch": 8, "accuracy": 100.00, "w1": 0.200, "w2": 0.300, "b": -0.100 },
      { "epoch": 9, "accuracy": 100.00, "w1": 0.200, "w2": 0.300, "b": -0.100 },
      { "epoch": 10, "accuracy": 100.00, "w1": 0.200, "w2": 0.300, "b": -0.100 }
    ],
    "final_weights": {
      "w1": 0.200,
      "w2": 0.300,
      "b": -0.100
    },
    "final_predictions": [
      { "x1": 0, "x2": 0, "predicted": 0, "actual": 0 },
      { "x1": 0, "x2": 1, "predicted": 1, "actual": 1 },
      { "x1": 1, "x2": 0, "predicted": 1, "actual": 1 },
      { "x1": 1, "x2": 1, "predicted": 1, "actual": 1 }
    ],
    "final_accuracy": 100.00,
    "training_log": "----EPOCH 1----\nAccuracy after Epoch 1: 50.00%\nUpdated Weights -> w1=-0.200, w2=0.300, b=0.100\n\n----EPOCH 2----\nAccuracy after Epoch 2: 50.00%\nUpdated Weights -> w1=-0.100, w2=0.300, b=0.100\n\n----EPOCH 3----\nAccuracy after Epoch 3: 50.00%\nUpdated Weights -> w1=-0.000, w2=0.300, b=0.100\n\n----EPOCH 4----\nAccuracy after Epoch 4: 50.00%\nUpdated Weights -> w1=0.100, w2=0.300, b=0.100\n\n----EPOCH 5----\nAccuracy after Epoch 5: 75.00%\nUpdated Weights -> w1=0.100, w2=0.300, b=0.000\n\n----EPOCH 6----\nAccuracy after Epoch 6: 50.00%\nUpdated Weights -> w1=0.200, w2=0.300, b=0.000\n\n----EPOCH 7----\nAccuracy after Epoch 7: 75.00%\nUpdated Weights -> w1=0.200, w2=0.300, b=-0.100\n\n----EPOCH 8----\nAccuracy after Epoch 8: 100.00%\nUpdated Weights -> w1=0.200, w2=0.300, b=-0.100\n\n----EPOCH 9----\nAccuracy after Epoch 9: 100.00%\nUpdated Weights -> w1=0.200, w2=0.300, b=-0.100\n\n----EPOCH 10----\nAccuracy after Epoch 10: 100.00%\nUpdated Weights -> w1=0.200, w2=0.300, b=-0.100"
  },
  
  "OR_0.05": {
    "operation": "OR",
    "lr": 0.05,
    "initial_params": {
      "w1": -0.400,
      "w2": 0.200,
      "b": -0.100
    },
    "dataset": [
      { "x1": 0, "x2": 0, "label": 0 },
      { "x1": 0, "x2": 1, "label": 1 },
      { "x1": 1, "x2": 0, "label": 1 },
      { "x1": 1, "x2": 1, "label": 1 }
    ],
    "training_epochs": [
      { "epoch": 1, "accuracy": 50.00, "w1": -0.300, "w2": 0.250, "b": 0.000 },
      { "epoch": 2, "accuracy": 25.00, "w1": -0.200, "w2": 0.300, "b": 0.050 },
      { "epoch": 3, "accuracy": 50.00, "w1": -0.150, "w2": 0.300, "b": 0.050 },
      { "epoch": 4, "accuracy": 50.00, "w1": -0.100, "w2": 0.300, "b": 0.050 },
      { "epoch": 5, "accuracy": 50.00, "w1": -0.050, "w2": 0.300, "b": 0.050 },
      { "epoch": 6, "accuracy": 50.00, "w1": -0.000, "w2": 0.300, "b": 0.050 },
      { "epoch": 7, "accuracy": 50.00, "w1": 0.050, "w2": 0.300, "b": 0.050 },
      { "epoch": 8, "accuracy": 75.00, "w1": 0.050, "w2": 0.300, "b": 0.000 },
      { "epoch": 9, "accuracy": 50.00, "w1": 0.100, "w2": 0.300, "b": 0.000 },
      { "epoch": 10, "accuracy": 75.00, "w1": 0.100, "w2": 0.300, "b": -0.050 }
    ],
    "final_weights": {
      "w1": 0.100,
      "w2": 0.300,
      "b": -0.050
    },
    "final_predictions": [
      { "x1": 0, "x2": 0, "predicted": 0, "actual": 0 },
      { "x1": 0, "x2": 1, "predicted": 1, "actual": 1 },
      { "x1": 1, "x2": 0, "predicted": 1, "actual": 1 },
      { "x1": 1, "x2": 1, "predicted": 1, "actual": 1 }
    ],
    "final_accuracy": 100.00,
    "training_log": "----EPOCH 1----\nAccuracy after Epoch 1: 50.00%\nUpdated Weights -> w1=-0.300, w2=0.250, b=0.000\n\n----EPOCH 2----\nAccuracy after Epoch 2: 25.00%\nUpdated Weights -> w1=-0.200, w2=0.300, b=0.050\n\n----EPOCH 3----\nAccuracy after Epoch 3: 50.00%\nUpdated Weights -> w1=-0.150, w2=0.300, b=0.050\n\n----EPOCH 4----\nAccuracy after Epoch 4: 50.00%\nUpdated Weights -> w1=-0.100, w2=0.300, b=0.050\n\n----EPOCH 5----\nAccuracy after Epoch 5: 50.00%\nUpdated Weights -> w1=-0.050, w2=0.300, b=0.050\n\n----EPOCH 6----\nAccuracy after Epoch 6: 50.00%\nUpdated Weights -> w1=-0.000, w2=0.300, b=0.050\n\n----EPOCH 7----\nAccuracy after Epoch 7: 50.00%\nUpdated Weights -> w1=0.050, w2=0.300, b=0.050\n\n----EPOCH 8----\nAccuracy after Epoch 8: 75.00%\nUpdated Weights -> w1=0.050, w2=0.300, b=0.000\n\n----EPOCH 9----\nAccuracy after Epoch 9: 50.00%\nUpdated Weights -> w1=0.100, w2=0.300, b=0.000\n\n----EPOCH 10----\nAccuracy after Epoch 10: 75.00%\nUpdated Weights -> w1=0.100, w2=0.300, b=-0.050"
  },
  
  "XOR_0.1": {
    "operation": "XOR",
    "lr": 0.1,
    "initial_params": {
      "w1": -0.251,
      "w2": 0.901,
      "b": 0.464
    },
    "dataset": [
      { "x1": 0, "x2": 0, "label": 0 },
      { "x1": 0, "x2": 1, "label": 1 },
      { "x1": 1, "x2": 0, "label": 1 },
      { "x1": 1, "x2": 1, "label": 0 }
    ],
    "training_epochs": [
      { "epoch": 1, "accuracy": 50.00, "w1": -0.351, "w2": 0.801, "b": 0.264 },
      { "epoch": 2, "accuracy": 25.00, "w1": -0.351, "w2": 0.701, "b": 0.164 },
      { "epoch": 3, "accuracy": 25.00, "w1": -0.351, "w2": 0.601, "b": 0.064 },
      { "epoch": 4, "accuracy": 25.00, "w1": -0.351, "w2": 0.501, "b": -0.036 },
      { "epoch": 5, "accuracy": 50.00, "w1": -0.351, "w2": 0.401, "b": -0.036 },
      { "epoch": 6, "accuracy": 50.00, "w1": -0.351, "w2": 0.301, "b": -0.036 },
      { "epoch": 7, "accuracy": 50.00, "w1": -0.351, "w2": 0.201, "b": -0.036 },
      { "epoch": 8, "accuracy": 50.00, "w1": -0.351, "w2": 0.101, "b": -0.036 },
      { "epoch": 9, "accuracy": 75.00, "w1": -0.251, "w2": 0.101, "b": 0.064 },
      { "epoch": 10, "accuracy": 25.00, "w1": -0.251, "w2": 0.001, "b": -0.036 }
    ],
    "final_weights": {
      "w1": -0.251,
      "w2": 0.001,
      "b": -0.036
    },
    "final_predictions": [
      { "x1": 0, "x2": 0, "predicted": 0, "actual": 0 },
      { "x1": 0, "x2": 1, "predicted": 0, "actual": 1 },
      { "x1": 1, "x2": 0, "predicted": 0, "actual": 1 },
      { "x1": 1, "x2": 1, "predicted": 0, "actual": 0 }
    ],
    "final_accuracy": 50.00,
    "training_log": "\n---- EPOCH 1 ----\nAccuracy after Epoch 1: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.801, b=0.264\n\n---- EPOCH 2 ----\nAccuracy after Epoch 2: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.701, b=0.164\n\n---- EPOCH 3 ----\nAccuracy after Epoch 3: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.601, b=0.064\n\n---- EPOCH 4 ----\nAccuracy after Epoch 4: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.501, b=-0.036\n\n---- EPOCH 5 ----\nAccuracy after Epoch 5: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.401, b=-0.036\n\n---- EPOCH 6 ----\nAccuracy after Epoch 6: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.301, b=-0.036\n\n---- EPOCH 7 ----\nAccuracy after Epoch 7: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.201, b=-0.036\n\n---- EPOCH 8 ----\nAccuracy after Epoch 8: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.101, b=-0.036\n\n---- EPOCH 9 ----\nAccuracy after Epoch 9: 75.00%\nUpdated Weights -> w1=-0.251, w2=0.101, b=0.064\n\n---- EPOCH 10 ----\nAccuracy after Epoch 10: 25.00%\nUpdated Weights -> w1=-0.251, w2=0.001, b=-0.036"
  },
  
  "XOR_0.05": {
    "operation": "XOR",
    "lr": 0.05,
    "initial_params": {
      "w1": -0.251,
      "w2": 0.901,
      "b": 0.464
    },
    "dataset": [
      { "x1": 0, "x2": 0, "label": 0 },
      { "x1": 0, "x2": 1, "label": 1 },
      { "x1": 1, "x2": 0, "label": 1 },
      { "x1": 1, "x2": 1, "label": 0 }
    ],
    "training_epochs": [
      { "epoch": 1, "accuracy": 50.00, "w1": -0.301, "w2": 0.851, "b": 0.364 },
      { "epoch": 2, "accuracy": 50.00, "w1": -0.351, "w2": 0.801, "b": 0.264 },
      { "epoch": 3, "accuracy": 25.00, "w1": -0.351, "w2": 0.751, "b": 0.214 },
      { "epoch": 4, "accuracy": 25.00, "w1": -0.351, "w2": 0.701, "b": 0.164 },
      { "epoch": 5, "accuracy": 25.00, "w1": -0.351, "w2": 0.651, "b": 0.114 },
      { "epoch": 6, "accuracy": 25.00, "w1": -0.351, "w2": 0.601, "b": 0.064 },
      { "epoch": 7, "accuracy": 25.00, "w1": -0.351, "w2": 0.551, "b": 0.014 },
      { "epoch": 8, "accuracy": 25.00, "w1": -0.351, "w2": 0.501, "b": -0.036 },
      { "epoch": 9, "accuracy": 50.00, "w1": -0.351, "w2": 0.451, "b": -0.036 },
      { "epoch": 10, "accuracy": 50.00, "w1": -0.351, "w2": 0.401, "b": -0.036 }
    ],
    "final_weights": {
      "w1": -0.351,
      "w2": 0.401,
      "b": -0.036
    },
    "final_predictions": [
      { "x1": 0, "x2": 0, "predicted": 0, "actual": 0 },
      { "x1": 0, "x2": 1, "predicted": 1, "actual": 1 },
      { "x1": 1, "x2": 0, "predicted": 0, "actual": 1 },
      { "x1": 1, "x2": 1, "predicted": 1, "actual": 0 }
    ],
    "final_accuracy": 50.00,
    "training_log": "\n---- EPOCH 1 ----\nAccuracy after Epoch 1: 50.00%\nUpdated Weights -> w1=-0.301, w2=0.851, b=0.364\n\n---- EPOCH 2 ----\nAccuracy after Epoch 2: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.801, b=0.264\n\n---- EPOCH 3 ----\nAccuracy after Epoch 3: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.751, b=0.214\n\n---- EPOCH 4 ----\nAccuracy after Epoch 4: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.701, b=0.164\n\n---- EPOCH 5 ----\nAccuracy after Epoch 5: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.651, b=0.114\n\n---- EPOCH 6 ----\nAccuracy after Epoch 6: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.601, b=0.064\n\n---- EPOCH 7 ----\nAccuracy after Epoch 7: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.551, b=0.014\n\n---- EPOCH 8 ----\nAccuracy after Epoch 8: 25.00%\nUpdated Weights -> w1=-0.351, w2=0.501, b=-0.036\n\n---- EPOCH 9 ----\nAccuracy after Epoch 9: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.451, b=-0.036\n\n---- EPOCH 10 ----\nAccuracy after Epoch 10: 50.00%\nUpdated Weights -> w1=-0.351, w2=0.401, b=-0.036"
  }
};
