package com.omega.exceptions

import java.lang.Exception

class NonExistingDocumentRequest: Exception("The Document Block Requested Is Not Present In The Block Chain") {
}