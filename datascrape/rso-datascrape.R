library('rvest')
library('dplyr')
library('httr')

url <- 'https://uws-community.symplicity.com/index.php?s=student_group'
page <- html_session(url)

get_table <- function(page, count) {
  #find group names
  name_text <- html_nodes(page,".grpl-name a") %>% html_text()
  df <- data.frame(name_text, stringsAsFactors = FALSE)
  
  #find text description
  desc_text <- html_nodes(page, ".grpl-purpose") %>% html_text()
  df$desc_text <- trimws(desc_text)
  
  #find emails
  #  find the parent nodes with html_nodes
  #  then find the contact information from each parent using html_node
  email_nodes<-html_nodes(page, "div.grpl-grp") %>% html_node( ".grpl-contact a") %>% html_text()
  df$emails<-email_nodes
  
  category_nodes <- html_nodes(page, "div.grpl-grp") %>% html_node(".grpl-type") %>% html_text()
  df$category<-category_nodes
  
  pic_nodes <-html_nodes(page, "div.grpl-grp") %>% html_node( ".grpl-logo img") %>% html_attr("src")
  df$logo <- paste0("https://uws-community.symplicity.com/", pic_nodes)
  
  if(count != 44) {
    return (rbind(df, get_table(page %>% follow_link(css = ".paging_nav a:last-child"), count + 1)))
  } else{
    return (df)
  }
}

RSO_data <- get_table(page, 0)
write.csv(RSO_data, file = "rso-data.csv")
 