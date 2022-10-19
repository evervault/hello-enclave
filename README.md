# HELLO CAGE

A simple node server that can be deployed into a Cage. 

## Endpoints

### Hello

A simple endpoint that returns a hello message and echoes any body passed into it back in the response. Any Evervault encrypted strings will be decrypted in the response to demonstrate automatic decryption within Cages.

```bash
curl --request GET \
  --url [CAGE_DOMAIN]/hello \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' \
  --data '{
	"name": "Ada",
	"dob": "10/12/1815"
}' -k
```

### Egress

An endpoint that calls out to a simple public API to demonstrate egress. NOTE: Egress must be enabled in your Cage's `cage.toml` file for this endpoint to work.

```bash
curl --request GET \
  --url [CAGE_DOMAIN]/egress \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' -k
```


### Encrypt

An endpoint that encrypts any JSON body is passed into it with your Evervault key. This is done through the crypto API available within the Cage when it's deployed.

```bash
curl --request POST \
  --url [CAGE_DOMAIN]/encrypt \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' \
  --data '{
	"name": "Claude",
	"dob": "30/04/1916"
}' -k
```

### Decrypt

An endpoint that decrypts any encrypted JSON body is passed into it with your Evervault key. This is done through the crypto API available within the Cage when it's deployed.

```bash
curl --request POST \
  --url [CAGE_DOMAIN]/decrypt \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' \
  --data '{
	"name": "EVERVAULT ENCRYPTED STRING",
	"dob": "EVERVAULT ENCRYPTED STRING"
}' -k
```

### Compute

An endpoint that runs simple computation on two inputs. It adds two numbers together. Try passing an encrypted number into this function to see how Cages can process sensitive data securely.

```bash
curl --request POST \
  --url [CAGE_DOMAIN]/compute \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' \
  --data '{	
	"b": "40",
	"a": "10"
    }' -k
```

With encrypted number (You will have to use a string encrypted with your own Evervault key. See encrypt endpoint):

```bash
curl --request POST \
  --url [CAGE_DOMAIN]/compute \
  --header 'Content-Type: application/json' \
  --header 'api-key: [EV-API-KEY]' \
  --data '{	
	"b": "EVERVAULT ENCRYPTED STRING",
	"a": "EVERVAULT ENCRYPTED STRING"
    }' -k
```
